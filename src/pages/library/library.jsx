import React, { useState, useEffect, useMemo } from 'react';
import { Container, Grid, CircularProgress, Box, Typography } from '@mui/material';
import SearchToolbar from './components/SearchToolbar';
import CardManhwa from './components/cardManhwa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/';

export default function Library() {
    const [manhwas, setManhwas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        genres: [],
        author: '',
        sort: 'A-Z',
        status: [],
    });
    const [allGenres, setAllGenres] = useState([]);
    const [allAuthors, setAllAuthors] = useState([]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}manhwa`);
                const data = await res.json();
                console.log(data);

                if (!mounted) return;

                if (data.ok && Array.isArray(data.manhwa)) {
                    setManhwas(data.manhwa);

                    // On récupère les genres et auteurs pour les filtres
                    const genresSet = new Set();
                    const authorsSet = new Set();

                    data.manhwa.forEach((m) => {
                        // Transforme genres en tableau si nécessaire
                        const genresArray = Array.isArray(m.genres)
                            ? m.genres
                            : typeof m.genres === 'string'
                                ? m.genres.split(',').map(g => g.trim())
                                : [];

                        genresArray.forEach((g) => genresSet.add(g));

                        if (m.author) authorsSet.add(m.author);
                    });

                    setAllGenres(Array.from(genresSet).sort());
                    setAllAuthors(Array.from(authorsSet).sort());
                } else {
                    setManhwas([]);
                    setAllGenres([]);
                    setAllAuthors([]);
                }
            } catch (err) {
                console.error(err);
                setManhwas([]);
                setAllGenres([]);
                setAllAuthors([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, []);



    // Filtrage + recherche + status
    const filteredManhwas = useMemo(() => {
        return manhwas
            .filter((m) => {
                // Search
                const searchMatch = m.title.toLowerCase().includes(filters.search.toLowerCase());
                // Genres
                const genresMatch =
                    filters.genres.length === 0 ||
                    (m.genres && filters.genres.every((g) => m.genres.includes(g)));
                // Author
                const authorMatch = !filters.author || m.author === filters.author;
                // Status
                const statusMatch =
                    filters.status.length === 0 || filters.status.includes(m.status || 'Ongoing');

                return searchMatch && genresMatch && authorMatch && statusMatch;
            })
            .sort((a, b) => {
                switch (filters.sort) {
                    case 'A-Z':
                        return (a.title || '').localeCompare(b.title || '');
                    case 'Z-A':
                        return (b.title || '').localeCompare(a.title || '');
                    case 'Newest':
                        return new Date(b.release_date) - new Date(a.release_date);
                    case 'Recent':
                        return new Date(b.updated_at) - new Date(a.updated_at);
                    case 'Chapters':
                        return (b.totalChapters || b.total_chapters || 0) - (a.totalChapters || a.total_chapters || 0);
                    default:
                        return 0;
                }
            });
    }, [manhwas, filters]);

    const handleCardClick = (manhwa) => {
        window.location.href = `/manhwa/${manhwa.slug || manhwa.manhwa_id}`;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <SearchToolbar
                filters={filters}
                onFiltersChange={setFilters}
                allGenres={allGenres}
                allAuthors={allAuthors}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            ) : filteredManhwas.length === 0 ? (
                <Typography variant="h6" sx={{ mt: 6, textAlign: 'center' }}>
                    No manhwa found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredManhwas.map((m) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={m.manhwa_id || m.id}>
                            <CardManhwa manhwa={m} onClick={handleCardClick} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
