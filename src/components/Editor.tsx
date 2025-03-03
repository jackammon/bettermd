import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Bold, Italic, Code, List, ListOrdered, Link, Image, Table, Download } from 'lucide-react';

interface EditorProps {
  initialValue?: string;
  onChange: (markdown: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue = '', onChange }) => {
  const [markdown, setMarkdown] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setMarkdown(initialValue);
    }
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);
    onChange(newMarkdown);
  };

  const insertFormat = (
    before: string,
    after: string,
    defaultText?: string
  ) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const selStart = textarea.selectionStart;
    const selEnd = textarea.selectionEnd;
    const selectedText = markdown.substring(selStart, selEnd);
    const text = selectedText || defaultText || '';

    const newText =
      markdown.substring(0, selStart) +
      before +
      text +
      after +
      markdown.substring(selEnd);

    setMarkdown(newText);
    onChange(newText);

    // Set focus back to textarea and restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selStart + before.length + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleExport = () => {
    // Create a Blob containing the markdown text
    const blob = new Blob([markdown], { type: 'text/markdown' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md'; // Default filename
    
    // Simulate click to trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-muted flex flex-wrap gap-1 items-center justify-between">
        <div className="flex flex-wrap gap-1 items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('**', '**', 'bold text')}
            title="Bold"
            className="h-8 w-8 p-0"
          >
            <Bold size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('*', '*', 'italic text')}
            title="Italic"
            className="h-8 w-8 p-0"
          >
            <Italic size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('`', '`', 'code')}
            title="Inline Code"
            className="h-8 w-8 p-0"
          >
            <Code size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('\n```\n', '\n```\n', 'code block')}
            title="Code Block"
            className="h-8 px-2"
          >
            <Code size={16} className="mr-1" /><span className="text-xs">Block</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('- ', '', 'list item')}
            title="Bullet List"
            className="h-8 w-8 p-0"
          >
            <List size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('1. ', '', 'list item')}
            title="Numbered List"
            className="h-8 w-8 p-0"
          >
            <ListOrdered size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('[', '](url)', 'link text')}
            title="Link"
            className="h-8 w-8 p-0"
          >
            <Link size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('![', '](image-url)', 'alt text')}
            title="Image"
            className="h-8 w-8 p-0"
          >
            <Image size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => insertFormat('\n| Header1 | Header2 |\n|---------|----------|\n| Cell1   | Cell2   |\n', '', '')}
            title="Table"
            className="h-8 w-8 p-0"
          >
            <Table size={16} />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          title="Export to Markdown"
          className="h-8 px-2"
        >
          <Download size={16} className="mr-1" />
          <span className="text-xs">Export .md</span>
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={markdown}
        onChange={handleChange}
        className="flex-1 resize-none font-mono p-4 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Type your markdown here..."
      />
    </div>
  );
};

export default Editor; 