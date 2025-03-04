import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewProps {
  markdown: string;
}

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Set up an observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full overflow-auto p-4 md:p-8 custom-scrollbar">
      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-3 prose-p:my-2 prose-p:leading-relaxed prose-pre:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-li:marker:text-gray-500 prose-img:rounded-md prose-img:shadow-sm prose-a:font-medium">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: CodeBlockProps) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div 
                  className="overflow-hidden rounded-md" 
                  style={!isDarkMode ? { backgroundColor: 'var(--tw-prose-pre-bg)' } : {}}
                >
                  <SyntaxHighlighter
                    // @ts-ignore - type definitions are incorrect but the library works
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: !isDarkMode ? 'var(--tw-prose-pre-bg)' : undefined,
                      color: 'var(--tw-prose-pre-code)'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Preview; 