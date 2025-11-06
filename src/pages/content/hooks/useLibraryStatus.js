import { useCallback, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/';

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
      if (data && data.ok && data.inLibrary) {
        setIsInLibrary(true);
        setReadingStatus(data.status ?? 'plan_to_read');
        setCurrentChapter(data.currentChapter ?? '');
        setUserRating(data.rating ?? '');
      } else {
        setIsInLibrary(false);
        setReadingStatus('plan_to_read');
        setCurrentChapter('');
        setUserRating('');
      }
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

      if (!res.ok || !data || !data.ok) {
        console.error('Save failed', res.status, data);
        if (res.status === 401) {
          showMessage?.('Unauthorized. Please login again.', 'error');
          return;
        }
        showMessage?.(data?.error || 'Failed to save to library', 'error');
        return;
      }

      showMessage?.('Saved to your library', 'success');
      onSuccess?.();
      setIsInLibrary(true);
      setReadingStatus(payload.status ?? 'plan_to_read');
      setCurrentChapter(payload.current_chapter != null ? payload.current_chapter : '');
      setUserRating(payload.rating != null ? payload.rating : '');
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
