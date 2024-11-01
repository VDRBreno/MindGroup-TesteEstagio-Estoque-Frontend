export default function getEnvOrDefault<T>(env: string, value: T) {
  if(import.meta.env[env]) {
    if(typeof value==='string')
      return import.meta.env[env] as T;

    if(!isNaN(+import.meta.env[env]))
      return +import.meta.env[env] as T;
  }
  
  return value as T;
}