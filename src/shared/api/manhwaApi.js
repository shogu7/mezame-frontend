async function tryFetch(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {

    return null;
  }
}

function slugify(text = "") {
  return text
    .toString()
    .normalize("NFKD") 
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapManhwa(raw) {
  const id = raw.manhwa_id ?? raw.id ?? raw._id ?? null;
  const title = raw.title ?? raw.name ?? "Untitled";
  return {
    id,
    title,
    originalTitle: raw.original_title ?? raw.originalTitle ?? null,
    description: raw.description ?? null,
    releaseDate: raw.release_date ?? raw.releaseDate ?? null,
    totalChapters: raw.total_chapters ?? raw.totalChapters ?? null,
    totalSeasons: raw.total_seasons ?? raw.totalSeasons ?? null,
    coverUrl: raw.coverUrl ?? raw.cover_url ?? raw.cover ?? null,
    slug: raw.slug ?? raw.slugified ?? (title ? slugify(title) : `manhwa-${id}`),
    raw,
  };
}

/**
 * Fetch latest manhwas from backend and return normalized array.
 * Tries multiple likely endpoints and returns the first successful normalized result.
 */
export async function fetchLatestManhwas(limit = 6) {
  const candidates = [
    `/api/manhwas/latest?limit=${limit}`,
    `/manhwas/latest?limit=${limit}`,
    `/api/manhwas?limit=${limit}&sort=latest`,
    `/manhwas?limit=${limit}&sort=latest`,
  ];

  for (const url of candidates) {
    const json = await tryFetch(url);
    if (!json) continue;

    // backend might return array directly or { items: [...] } or { manhwas: [...] } etc.
    let items = [];
    if (Array.isArray(json)) items = json;
    else if (Array.isArray(json.items)) items = json.items;
    else if (Array.isArray(json.manhwas)) items = json.manhwas;
    else if (Array.isArray(json.data)) items = json.data;
    else if (Array.isArray(json.rows)) items = json.rows;
    else if (json && typeof json === "object") {
      // fallback: try to find the first array property
      const firstArray = Object.values(json).find(Array.isArray);
      if (firstArray) items = firstArray;
    }

    // if nothing found but json looks like an object that *is* one manhwa
    if (!items.length && json && (json.manhwa_id || json.id)) items = [json];

    if (items.length) {
      return items.map(mapManhwa);
    }
  }

  // none worked or empty -> return empty array
  return [];
}