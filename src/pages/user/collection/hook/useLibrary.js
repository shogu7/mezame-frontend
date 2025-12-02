import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_BASE = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE}/api/`
  : 'http://localhost:4000/api/';

const DBG = false;

function log(...args) { if (DBG) console.log('[useLibrary]', ...args); }
function logError(...args) { console.error('[useLibrary]', ...args); }

const formatStatus = (status) => {
  if (status === null || status === undefined) return '';
  return String(status)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const normalizeStatusToken = (raw) => {
  if (raw === null || raw === undefined) return 'plan_to_read';
  const s = String(raw).trim().toLowerCase();

  if (s === '' || s === 'null' || s === 'neutral') return 'plan_to_read';
  if (s === 'finished' || s === 'finished') return 'finished';
  if (s === 'dropped') return 'dropped';
  if (s === 'reading') return 'reading';
  if (s === 'plan_to_read' || s === 'plan to read') return 'plan_to_read';
  if (s === 'on_hold' || s === 'on hold') return 'on_hold';

  return s.replace(/\s+/g, '_');
};

export function useLibrary(userIdOrUsername) {
  const [user, setUser] = useState(null);
  const [allManhwa, setAllManhwa] = useState([]);
  const [manhwaList, setManhwaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    genres: [],
    author: null,
    sort: 'A-Z',
    status: [],
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [allGenres, setAllGenres] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);

  // read token once
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      log('token present?', !!token);
      if (token) {
        try {
          const payload = jwtDecode(token);
          log('decoded token payload', payload);
          setUser(payload);
        } catch (e) {
          logError('jwtDecode failed', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      logError('error reading token', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLibrary = useCallback(async () => {
    const token = localStorage.getItem('token');
    let identifier = userIdOrUsername;
    if (!identifier && token) {
      try {
        const p = jwtDecode(token);
        identifier = p?.id ?? p?.user_id ?? p?.userId ?? p?.username;
        log('identifier resolved from token:', identifier);
      } catch (e) {
        logError('failed to decode token for identifier', e);
      }
    } else {
      log('identifier from hook arg:', identifier);
    }

    if (!identifier) {
      log('No identifier available — clearing list');
      setAllManhwa([]);
      setLoading(false);
      return;
    }

    const url = `${API_BASE}user/${identifier}/library`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    log('About to GET library', { url, params: { page, pageSize }, headers });

    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers,
        params: { page, pageSize, _ts: Date.now() }, 
      });

      log('raw GET response status:', res.status);
      if (res && res.data) {
        log('raw GET response.data (first 2 items):', (res.data.items || []).slice(0, 2));
      } else {
        log('GET returned no data');
      }

      if (res.data && res.data.ok) {
        const itemsRaw = res.data.items || [];
        log(`Mapping ${itemsRaw.length} items from API...`);
        const items = itemsRaw.map((m, idx) => {
          const rawUserStatus =
            m.status ??
            m.userStatus ??
            m.personal_status ??
            m.personalStatus ??
            m.user_status ??
            m.note_status ??
            null;

          const finalToken = normalizeStatusToken(m.userStatus ?? rawUserStatus ?? m.status ?? null);

          const mapped = {
            ...m,
            originalStatus: m.status ?? null,
            apiUserStatusRaw: m.userStatus ?? rawUserStatus ?? null,
            status: finalToken, // *canonical token* used by UI
            displayStatus: formatStatus(finalToken),
          };

          if (DBG && idx < 50) {
            log(`item[${idx}] id=${getFieldSafe(m, 'id')} title="${m.title || m.name || 'n/a'}" -> originalStatus=${mapped.originalStatus} apiUserStatusRaw=${mapped.apiUserStatusRaw} => status=${mapped.status} display="${mapped.displayStatus}"`);
          }

          return mapped;
        });

        log('Final mapped items (first 5):', items.slice(0, 5).map(it => ({ id: getFieldSafe(it, 'id'), title: it.title, status: it.status, displayStatus: it.displayStatus, apiUserStatusRaw: it.apiUserStatusRaw })));
        setAllManhwa(items);
      } else {
        log('GET response not ok or no items', res.data);
        setAllManhwa([]);
      }
    } catch (err) {
      logError('fetchLibrary axios error', err?.response?.status, err?.response?.data ?? err.message ?? err);
      setAllManhwa([]);
    } finally {
      setLoading(false);
    }
  }, [userIdOrUsername, user, page, pageSize]);

  function getFieldSafe(obj, key) {
    if (!obj) return null;
    return obj[key] ?? obj.id ?? obj.manhwa_id ?? obj.slug ?? null;
  }

  useEffect(() => {
    log('fetchLibrary effect triggered');
    fetchLibrary();
  }, [fetchLibrary]);

  useEffect(() => {
    const onLibraryUpdated = (e) => {
      log('libraryUpdated event received', e?.detail ?? '(no detail)');
      // small delay to let server commit if needed, try immediate refetch first
      fetchLibrary();
    };
    window.addEventListener('libraryUpdated', onLibraryUpdated);
    return () => {
      window.removeEventListener('libraryUpdated', onLibraryUpdated);
    };
  }, [fetchLibrary]);

  useEffect(() => {
    log('Applying filters to allManhwa: count=', allManhwa.length, 'filters=', filters);
    let filtered = Array.isArray(allManhwa) ? [...allManhwa] : [];

    if (filters.search) {
      filtered = filtered.filter((m) =>
        (m.title || '').toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.genres && filters.genres.length) {
      filtered = filtered.filter((m) =>
        (m.genres || []).some((g) => filters.genres.includes(g))
      );
    }
    if (filters.author) {
      filtered = filtered.filter((m) => m.author === filters.author);
    }
    if (filters.status && filters.status.length) {
      const normFilters = filters.status.map(s => String(s).trim().toLowerCase().replace(/ /g, '_'));
      filtered = filtered.filter((m) => {
        const token = String(m.status || m.displayStatus || '').toLowerCase().replace(/ /g, '_');
        return normFilters.includes(token) || normFilters.includes(String(m.displayStatus || '').toLowerCase().replace(/ /g, '_'));
      });
    }

    filtered.sort((a, b) => {
      try {
        switch (filters.sort) {
          case 'A-Z':
            return (a.title || '').localeCompare(b.title || '');
          case 'Z-A':
            return (b.title || '').localeCompare(a.title || '');
          case 'Newest':
            return new Date(b.releaseDate || b.release_date || 0) - new Date(a.releaseDate || a.release_date || 0);
          case 'Recent':
            return new Date(b.addedAt || b.added_at || 0) - new Date(a.addedAt || a.added_at || 0);
          case 'Chapters':
            return (b.totalChapters || b.total_chapters || 0) - (a.totalChapters || a.total_chapters || 0);
          default:
            return 0;
        }
      } catch (e) {
        return 0;
      }
    });

    setTotalPages(Math.max(1, Math.ceil(filtered.length / Math.max(1, pageSize))));
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    log(`Filtered -> ${filtered.length} items, showing ${slice.length} for page ${page}/${Math.ceil(filtered.length / pageSize)}`);
    setManhwaList(slice);
  }, [allManhwa, filters, page, pageSize]);


  useEffect(() => {
    const genresSet = new Set();
    const authorsSet = new Set();
    (allManhwa || []).forEach((m) => {
      (Array.isArray(m.genres) ? m.genres : (typeof m.genres === 'string' ? m.genres.split(',').map(x => x.trim()) : [])).forEach(g => { if (g) genresSet.add(g); });
      if (m.author) authorsSet.add(m.author);
    });
    setAllGenres(Array.from(genresSet));
    setAllAuthors(Array.from(authorsSet));
    log('allGenres size=', genresSet.size, 'allAuthors size=', authorsSet.size);
  }, [allManhwa]);

  // expose API
  return {
    manhwaList,
    allManhwa,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    allGenres,
    allAuthors,
    refreshLibrary: fetchLibrary,
  };
}

export default useLibrary;
