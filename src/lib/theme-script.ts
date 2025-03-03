// Script to be injected into the document head for early theme detection
export const themeScript = `
  (function() {
    // Get theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    
    // Apply theme based on localStorage or system preference
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
`; 