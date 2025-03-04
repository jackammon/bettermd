import { useState, useEffect } from 'react';
import './App.css';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ToggleTheme from './components/ui/toggle-theme';
import { Card } from './components/ui/card';

const STORAGE_KEY = 'bettermd-content';

function App() {
  const [markdown, setMarkdown] = useState<string>('');
  
  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      setMarkdown(savedContent);
    } else {
      // Default starter content
      setMarkdown(`# Welcome to BetterMD

This is a live markdown editor.

## Features

- **Live Preview**: See your changes as you type
- **GitHub Flavored Markdown**: Full support for tables, code blocks, and more
- **Local Storage**: Your content is automatically saved as you type

## Example Features

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Feature | Support |
|---------|---------|
| Tables | ✅ |
| Lists | ✅ |
| Code Blocks | ✅ |
| Math | ✅ |

### Task Lists

- [x] Create markdown editor
- [x] Add GitHub-flavored markdown support
- [x] Implement local storage
- [ ] Add more features

Try editing this content to see the changes in real-time!
`);
    }
  }, []);

  // Save content to localStorage when markdown changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, markdown);
    }, 300); // Debounce for performance

    return () => clearTimeout(timeoutId);
  }, [markdown]);

  const handleChange = (content: string) => {
    setMarkdown(content);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-[hsl(222.2,84%,4.9%)] text-white p-4 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">BetterMD</h1>
          <p className="text-xs opacity-90">Live Markdown and LaTeX Editor</p>
        </div>
        <ToggleTheme />
      </header>
      
      {/* Main content */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden p-4 gap-4">
        {/* Editor panel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden shadow-md theme-card">
            <Editor initialValue={markdown} onChange={handleChange} />
          </Card>
        </div>
        
        {/* Preview panel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden shadow-md theme-card">
            <Preview markdown={markdown} />
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-2 text-center text-xs border-t">
        <p>Content is automatically saved to your browser's local storage</p>
      </footer>
    </div>
  );
}

export default App;
