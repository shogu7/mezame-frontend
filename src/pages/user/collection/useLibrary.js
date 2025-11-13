import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/';

const formatStatus = (status) => {
  if (!status && status !== 0) return '';
  return String(status)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

  // token grab
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchLibrary = useCallback(async () => {
    const identifier = userIdOrUsername || user?.username;
    if (!identifier) {
      setAllManhwa([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}user/${identifier}/library`, {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
        params: { page, pageSize },
      });

      if (res.data && res.data.ok) {
        const items = (res.data.items || []).map((m) => ({
          ...m,
          displayStatus: formatStatus(m.status ?? m.userStatus ?? ''),
        }));
        setAllManhwa(items);
      } else {
        setAllManhwa([]);
      }
    } catch (err) {
      console.error(err);
      setAllManhwa([]);
    } finally {
      setLoading(false);
    }
  }, [user, userIdOrUsername, page, pageSize]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  useEffect(() => {
    let filtered = [...allManhwa];

    if (filters.search) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.genres.length) {
      filtered = filtered.filter((m) =>
        m.genres?.some((g) => filters.genres.includes(g))
      );
    }
    if (filters.author) {
      filtered = filtered.filter((m) => m.author === filters.author);
    }
    if (filters.status.length) {
      filtered = filtered.filter(
        (m) =>
          filters.status.includes(m.status) ||
          filters.status.includes(m.displayStatus)
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'A-Z':
          return a.title.localeCompare(b.title);
        case 'Z-A':
          return b.title.localeCompare(a.title);
        case 'Newest':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'Recent':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'Chapters':
          return (b.totalChapters || 0) - (a.totalChapters || 0);
        default:
          return 0;
      }
    });

    setTotalPages(Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;
    setManhwaList(filtered.slice(start, start + pageSize));
  }, [allManhwa, filters, page, pageSize]);

  useEffect(() => {
    const genresSet = new Set();
    const authorsSet = new Set();
    allManhwa.forEach((m) => {
      (m.genres || []).forEach((g) => genresSet.add(g));
      if (m.author) authorsSet.add(m.author);
    });
    setAllGenres(Array.from(genresSet));
    setAllAuthors(Array.from(authorsSet));
  }, [allManhwa]);

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
