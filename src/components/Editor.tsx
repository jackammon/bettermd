import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Bold, Italic, Code, List, ListOrdered, Link, Image, Table, Download } from 'lucide-react';

interface EditorProps {
  initialValue?: string;
  onChange: (markdown: string) => void;
}

interface LineInfo {
  number: number | null;
  isNewLine: boolean;
}

const Editor: React.FC<EditorProps> = ({ initialValue = '', onChange }) => {
  const [markdown, setMarkdown] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<LineInfo[]>([{ number: 1, isNewLine: true }]);

  useEffect(() => {
    if (initialValue) {
      setMarkdown(initialValue);
    }
  }, [initialValue]);

  // Calculate line wrapping
  const calculateLineWrapping = useCallback(() => {
    if (!textareaRef.current || !scrollContainerRef.current) return;
    
    const textarea = textareaRef.current;
    const textareaWidth = textarea.clientWidth - parseInt(getComputedStyle(textarea).paddingLeft) - parseInt(getComputedStyle(textarea).paddingRight);
    
    // Create a clone to measure text
    const measureDiv = document.createElement('div');
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.position = 'absolute';
    measureDiv.style.width = `${textareaWidth}px`;
    measureDiv.style.fontFamily = getComputedStyle(textarea).fontFamily;
    measureDiv.style.fontSize = getComputedStyle(textarea).fontSize;
    measureDiv.style.lineHeight = getComputedStyle(textarea).lineHeight;
    measureDiv.style.whiteSpace = 'pre-wrap';
    measureDiv.style.overflowWrap = 'break-word';
    measureDiv.style.wordBreak = 'break-word';
    measureDiv.style.tabSize = '2';
    document.body.appendChild(measureDiv);
    
    // Process each logical line from the text
    const lines = markdown.split('\n');
    let lineInfos: LineInfo[] = [];
    
    lines.forEach((line, index) => {
      // Get line height from computed style to match the textarea
      measureDiv.textContent = line || ' '; // Use space for empty lines
      
      // Calculate how many visual lines this takes (wrapped lines)
      const lineHeight = parseFloat(getComputedStyle(measureDiv).lineHeight);
      const wrappedLines = Math.ceil(measureDiv.scrollHeight / lineHeight);
      
      // First line gets a line number
      lineInfos.push({ number: index + 1, isNewLine: true });
      
      // Any wrapped continuation lines get null (no line number)
      for (let i = 1; i < wrappedLines; i++) {
        lineInfos.push({ number: null, isNewLine: false });
      }
    });
    
    document.body.removeChild(measureDiv);
    setVisibleLines(lineInfos);
  }, [markdown]);

  // Update line calculations when content or size changes
  useEffect(() => {
    calculateLineWrapping();
    
    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      calculateLineWrapping();
    });
    
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    
    window.addEventListener('resize', calculateLineWrapping);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateLineWrapping);
    };
  }, [markdown, calculateLineWrapping]);

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

  // Shared styles for consistent rendering
  const sharedStyles = {
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace",
    fontSize: "0.875rem",
    lineHeight: "1.5",
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-2 flex flex-wrap gap-1 items-center justify-between border-b">
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
      
      {/* Editor with single scroll for both line numbers and content */}
      <div 
        ref={editorContainerRef}
        className="flex-1 relative overflow-hidden"
      >
        {/* Single scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-auto custom-scrollbar"
        >
          <div className="flex w-full min-h-full">
            {/* Line numbers column */}
            <div 
              className="w-12 border-r bg-muted/40 flex-shrink-0 select-none"
              style={{
                ...sharedStyles,
                textAlign: "right",
                position: "sticky",
                left: 0,
                zIndex: 10,
              }}
            >
              <div className="py-[0.5rem]">
                {visibleLines.map((line, idx) => (
                  <div key={idx} className="h-[1.5em] pr-2 text-muted-foreground">
                    {line.isNewLine ? line.number : ''}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Textarea - positioned within the scrollable container */}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={markdown}
                onChange={handleChange}
                className="w-full min-h-full resize-none outline-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent overflow-hidden"
                placeholder="Type your markdown here..."
                style={{
                  ...sharedStyles,
                  padding: "0.5rem",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  tabSize: 2,
                  caretColor: "currentColor",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor; 