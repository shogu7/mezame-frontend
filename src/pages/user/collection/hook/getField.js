function toCamel(s) {
  return s.replace(/[_-][a-z]/gi, (m) => m.charAt(1).toUpperCase());
}
function toSnake(s) {
  return s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`).replace(/^_/, '');
}

function tryGet(o, key) {
  if (o == null) return undefined;
  if (Object.prototype.hasOwnProperty.call(o, key) && o[key] !== undefined) return o[key];
  return undefined;
}

export function getField(obj, ...keys) {
  if (obj == null) return undefined;

  const flatKeys = keys.length === 1 && Array.isArray(keys[0]) ? keys[0] : keys;

  for (const k of flatKeys) {
    if (!k) continue;
    let v = tryGet(obj, k);
    if (v !== undefined) return v;

    const camel = toCamel(k);
    v = tryGet(obj, camel);
    if (v !== undefined) return v;

    const snake = toSnake(k);
    v = tryGet(obj, snake);
    if (v !== undefined) return v;

    v = tryGet(obj, String(k).toLowerCase());
    if (v !== undefined) return v;

    if (obj.raw && typeof obj.raw === 'object') {
      v = tryGet(obj.raw, k) ?? tryGet(obj.raw, camel) ?? tryGet(obj.raw, snake);
      if (v !== undefined) return v;
    }

    if (obj.manhwa && typeof obj.manhwa === 'object') {
      v = tryGet(obj.manhwa, k) ?? tryGet(obj.manhwa, camel) ?? tryGet(obj.manhwa, snake);
      if (v !== undefined) return v;
    }
  }

  return undefined;
}

export default getField; 
// use to get values from objects safely, even if the keys are in different styles or inside other objects.
