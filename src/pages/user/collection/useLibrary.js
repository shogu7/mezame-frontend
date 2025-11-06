import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { jwtDecode } from 'jwt-decode';

// const API_BASE = 'http://localhost:4000/api/';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/'; // TODO: Fix api call with .env

export function useLibrary() {
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
  }, []);

  const fetchLibrary = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}user/library`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    if (res.data.ok) {
      setAllManhwa(res.data.items); 
      console.log('Fetched manhwa items:', res.data.items);
      console.log(JSON.stringify(res.data.items[0], null, 2));
    } else {
      setAllManhwa([]);
    }
    } catch (err) {
      console.error(err);
      console.log('Error fetching library, setting allManhwa to empty array.');
      setAllManhwa([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
    if (filters.genres.length > 0) {
      filtered = filtered.filter((m) => m.genres?.some((g) => filters.genres.includes(g)));
    }
    if (filters.author) {
      filtered = filtered.filter((m) => m.author === filters.author);
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter((m) => filters.status.includes(m.status));
    }

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'A-Z': return a.title.localeCompare(b.title);
        case 'Z-A': return b.title.localeCompare(a.title);
        case 'Newest': return new Date(b.release_date) - new Date(a.release_date);
        case 'Recent': return new Date(b.added_at) - new Date(a.added_at);
        case 'Chapters': return (b.total_chapters || 0) - (a.total_chapters || 0);
        default: return 0;
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

  const toggleFollow = async (manhwa) => {
    if (!user) return;
    try {
      const manhwaId = manhwa.id;
      await axios.post(`${API_BASE}user/library`, { manhwa_id: manhwaId, status: manhwa.status });
      fetchLibrary();
    } catch (err) {
      console.error(err);
    }
  };

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
    toggleFollow,
  };
}
