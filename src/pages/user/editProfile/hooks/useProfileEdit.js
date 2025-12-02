import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useProfileEdit(authUser) {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE
    ? `${process.env.REACT_APP_API_BASE}/api/`
    : 'http://localhost:4000/api/';

  const [profile, setProfile] = useState({
    username: '',
    avatar_url: '',
    bio: '',
    pinnedManhwa: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [availableManhwa, setAvailableManhwa] = useState([]);
  const [loadingManhwa, setLoadingManhwa] = useState(false);

  const getToken = useCallback(() => authUser?.token || localStorage.getItem('token') || null, [authUser?.token]);

  useEffect(() => {
    if (authUser === undefined) {
      return;
    }

    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchProfile = async () => {

      try {
        setError(null);

        const res = await fetch(`${API_BASE}user/me`, {
          method: 'GET',
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        const avatar = data.user?.avatar_url ?? '';

        setProfile({
          username: data.user?.username || '',
          avatar_url: avatar,
          bio: data.user?.bio || '',
          pinnedManhwa: data.user?.pinnedManhwa || [],
        });
        setAvatarPreview(avatar);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [API_BASE, authUser, getToken]);

  useEffect(() => {
    if (!authUser) return;

    const controller = new AbortController();

    const fetchLibrary = async () => {
      const token = getToken();
      if (!token) return;

      try {
        setLoadingManhwa(true);
        const userId = authUser?.user_id || authUser?.username;
        if (!userId) return;

        const res = await fetch(`${API_BASE}user/${userId}/library?pageSize=200`, {
          method: 'GET',
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch library');

        const data = await res.json();
        if (data.ok && Array.isArray(data.items)) {
          setAvailableManhwa(data.items);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load library:', err);
        }
      } finally {
        setLoadingManhwa(false);
      }
    };

    fetchLibrary();
    return () => controller.abort();
  }, [getToken, authUser, API_BASE]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { setError('Image trop grande (max 4MB).'); return; }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handlePinnedManhwaChange = useCallback((event, newValue) => {
    if (newValue.length > 6) {
      setError('You can pin a maximum of 6 manhwa');
      return;
    }
    setProfile(p => ({ ...p, pinnedManhwa: newValue }));
  }, []);

  const removePinnedManhwa = useCallback((manhwaToRemove) => {
    setProfile(p => ({
      ...p,
      pinnedManhwa: p.pinnedManhwa.filter(m => m.id !== manhwaToRemove.id)
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setError(null);
    const token = getToken();
    if (!token) { setError('Jeton manquant. Veuillez vous reconnecter.'); return; }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('username', profile.username);
      formData.append('bio', profile.bio || '');
      formData.append('pinnedManhwa', JSON.stringify(profile.pinnedManhwa || []));
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await fetch(`${API_BASE}user/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = `Server error (${res.status})`;
        try { msg = JSON.parse(text).error || msg; } catch (e) { }
        throw new Error(msg);
      }

      const data = await res.json();
      const returnedAvatar = data.user?.avatar_url ?? profile.avatar_url;

      setProfile(p => ({
        ...p,
        username: data.user?.username ?? p.username,
        bio: data.user?.bio ?? p.bio,
        pinnedManhwa: data.user?.pinnedManhwa ?? p.pinnedManhwa,
        avatar_url: returnedAvatar,
      }));
      setAvatarPreview(returnedAvatar);
      setAvatarFile(null);
      setSuccessOpen(true);

      setTimeout(() => navigate(`/profile/${authUser?.user_id}`), 900);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }, [getToken, profile, avatarFile, API_BASE, navigate, authUser?.user_id]);

  return {
    profile,
    loading,
    saving,
    error,
    successOpen,
    avatarPreview,
    availableManhwa,
    loadingManhwa,
    handleChange,
    handleAvatarChange,
    handlePinnedManhwaChange,
    removePinnedManhwa,
    handleSave,
    setError,
    setSuccessOpen,
    authUser
  };
}