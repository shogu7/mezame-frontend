import { useEffect, useState } from 'react';
import axios from 'axios';
import '../display/styles/manhwa.css'

export default function ManhwaList() {
  const [manhwa, setManhwa] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/manhwa')
      .then(res => { if (res.data.ok) setManhwa(res.data.manhwa); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (!manhwa.length) return <p className="loading">No manhwa found.</p>;

  return (
    <div className="manhwa-list-container">
      <h2>All Manhwa</h2>
      <ul className="manhwa-list">
        {manhwa.map(m => (
          <li key={m.manhwa_id} className="manhwa-item">
            <strong>{m.title}</strong> ({m.original_title}) - Chapters: {m.total_chapters}
            <p>{m.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

