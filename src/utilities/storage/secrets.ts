export function getAcessToken(key: string): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }
  
  export function removeAcessToken(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
  
  export function setAcessToken(key: string, value: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }