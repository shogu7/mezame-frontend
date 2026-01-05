import React from 'react';
import useLibrary from '../hooks/useLibrary';

export default function LibraryButton({ manhwa }) {
  const { isInLibrary, addOrUpdate, remove } = useLibrary();
  const inLibrary = isInLibrary(manhwa.id);

  const handleToggle = async () => {
    if (inLibrary) await addOrUpdate(manhwa.id, 'plan_to_read', 0, null); // reset
    else await addOrUpdate(manhwa.id, 'reading', 1, null);
  };

  const handleRemove = async () => { if (inLibrary) await remove(manhwa.id); };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={handleToggle}>{inLibrary ? 'Reset' : 'Add'}</button>
      {inLibrary && <button onClick={handleRemove}>Remove</button>}
    </div>
  );
}
