export function getCookie(name: string): string | null {
    const cookies = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`));
    
    return cookies ? decodeURIComponent(cookies.split('=')[1]) : null;
  }