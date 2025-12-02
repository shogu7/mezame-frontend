import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../shared/context/authContext';

export function useUserProfile(paramUserId) {
  const { user: authUser } = useAuth();
  const API_BASE = process.env.REACT_APP_API_BASE
    ? `${process.env.REACT_APP_API_BASE}/api/`
    : 'http://localhost:4000/api/';

  const [resolvedUserId, setResolvedUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const [library, setLibrary] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [libraryError, setLibraryError] = useState(null);

  const [filters] = useState({ search: '', genres: [], author: null });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({ total: 0, reading: 0, completed: 0 });

  useEffect(() => {
    if (!paramUserId && authUser) {
      setResolvedUserId(authUser.username || authUser.user_id);
    } else {
      setResolvedUserId(paramUserId || null);
    }
  }, [paramUserId, authUser]);

  useEffect(() => {
    if (!resolvedUserId) return;
    const ac = new AbortController();

    (async () => {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const res = await fetch(`${API_BASE}user/${encodeURIComponent(resolvedUserId)}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || !data.ok) throw new Error(data?.error || 'Invalid response');
        setProfile(data.user);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setProfile(null);
        setProfileError(err.message || 'Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    })();

    return () => ac.abort();
  }, [resolvedUserId, API_BASE]);

  useEffect(() => {
    if (!resolvedUserId) return;
    const ac = new AbortController();

    (async () => {
      setLoadingLibrary(true);
      setLibraryError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          search: filters.search || '',
        });
        const url = `${API_BASE}user/${encodeURIComponent(resolvedUserId)}/library?${params.toString()}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || !data.ok) throw new Error(data?.error || 'Invalid library response');

        setLibrary(Array.isArray(data.items) ? data.items : []);
        setTotalPages(Math.max(1, Math.ceil((data.total || 0) / pageSize)));

        const reading = (data.items || []).filter(i => i.status === 'reading').length;
        const completed = (data.items || []).filter(i => i.status === 'completed').length;
        setStats({ total: Number(data.total || 0), reading, completed });

      } catch (err) {
        if (err.name === 'AbortError') return;
        setLibrary([]);
        setLibraryError(err.message || 'Failed to load library');
      } finally {
        setLoadingLibrary(false);
      }
    })();

    return () => ac.abort();
  }, [resolvedUserId, page, pageSize, filters, API_BASE]);

  const handlePageChange = useCallback((e, v) => {
    setPage(v);
  }, []);

  const isOwnProfile = authUser && profile && String(authUser.user_id) === String(profile.user_id);

  return {
    profile,
    loadingProfile,
    profileError,
    library,
    loadingLibrary,
    libraryError,
    stats,
    isOwnProfile,
    page,
    totalPages,
    handlePageChange,
    authUser,
  };
}