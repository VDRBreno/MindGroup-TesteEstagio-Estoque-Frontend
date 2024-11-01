export default function getLocalStorageOrDefault<T>(key: string, value: T) {
  const stored = localStorage.getItem(key);
  if(!stored)
    return value as T;
  if(typeof value==='number' && !isNaN(+stored))
    return +stored as T;
  return stored;
}