import { useCallback, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE}/api/`
  : 'http://localhost:4000/api/';

const frontToDbStatusMap = {
  'plan_to_read': 'plan_to_read',
  'reading': 'reading',
  'on_hold': 'on_hold',
  'completed': 'completed',
  'dropped': 'dropped',
};

export default function useLibraryStatus(showMessage) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [readingStatus, setReadingStatus] = useState('plan_to_read');
  const [currentChapter, setCurrentChapter] = useState('');
  const [userRating, setUserRating] = useState('');
  const [saving, setSaving] = useState(false);

  const checkLibraryStatus = useCallback(async (manhwaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsInLibrary(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}user/lib/${manhwaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          showMessage?.('Unauthorized. Please login.', 'warning');
          window.location.href = '/login';
        }
        setIsInLibrary(false);
        return;
      }

      const data = await res.json().catch(() => null);
      console.log('checkLibraryStatus response', data);

      const serverStatus =
        (data && (data.status || data.entry?.status || data.library?.status || data.data?.status)) ?? null;

      const explicitInLibrary = data && (data.inLibrary === true || data.inLibrary === false);

      if (explicitInLibrary && data.inLibrary === false) {
        setIsInLibrary(false);
        setReadingStatus('plan_to_read');
        setCurrentChapter('');
        setUserRating('');
        return;
      }

      if (serverStatus) {
        setIsInLibrary(true);
        setReadingStatus(String(serverStatus).toLowerCase());
        setCurrentChapter(data.currentChapter ?? '');
        setUserRating(data.rating ?? '');
        return;
      }

      if (explicitInLibrary && data.inLibrary === true) {
        setIsInLibrary(true);
        setReadingStatus('plan_to_read');
        setCurrentChapter(data.currentChapter ?? '');
        setUserRating(data.rating ?? '');
        return;
      }

      return;
    } catch (err) {
      console.error('checkLibraryStatus error', err);
      setIsInLibrary(false);
    }
  }, [showMessage]);

  const saveToLibrary = useCallback(async (payload, onSuccess) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage?.('You must be logged in to save to library', 'warning');
      return;
    }

    const payloadToSend = {
      ...payload,
      status: frontToDbStatusMap[payload.status] ?? 'plan_to_read',
    };

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}user/library`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payloadToSend)
      });

      console.log('Saving to library payload:', payloadToSend);
      console.log('Save response status:', res.status);

      const data = await res.json().catch(() => null);
      console.log('Save response json:', data);

      if (!res.ok || !data || !data.ok) {
        console.error('Save failed', res.status, data);
        if (res.status === 401) {
          showMessage?.('Unauthorized. Please login again.', 'error');
          return;
        }
        showMessage?.(data?.error || 'Failed to save to library', 'error');
        return;
      }

      const savedStatus =
        (data && (data.status || data.entry?.status || data.library?.status || data.data?.status)) ?? null;

      const finalStatus = savedStatus ? String(savedStatus).toLowerCase() : (payload.status ?? 'plan_to_read');

      setIsInLibrary(true);
      setReadingStatus(finalStatus);
      setCurrentChapter(payload.current_chapter != null ? payload.current_chapter : '');
      setUserRating(payload.rating != null ? payload.rating : '');

      showMessage?.('Saved to your library', 'success');
      onSuccess?.();
    } catch (err) {
      console.error('Save failed', err);
      showMessage?.('Network error while saving', 'error');
    } finally {
      setSaving(false);
    }
  }, [showMessage]);

  return {
    isInLibrary,
    readingStatus,
    setReadingStatus,
    currentChapter,
    setCurrentChapter,
    userRating,
    setUserRating,
    saving,
    checkLibraryStatus,
    saveToLibrary,
  };
}
