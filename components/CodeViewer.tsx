import React from 'react';

interface CodeViewerProps {
  code: string;
  activeLine: number;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, activeLine }) => {
  const lines = code.split('\n');

  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg overflow-hidden shadow-lg h-full flex flex-col font-mono text-sm border-4 border-slate-700">
      <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-bold tracking-widest uppercase border-b border-slate-700 flex justify-between">
        <span>source.cpp</span>
        <span>C++</span>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-0.5">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`flex transition-colors duration-200 ${
              idx === activeLine
                ? 'bg-yellow-500/30 border-l-4 border-yellow-400 text-yellow-100'
                : 'text-slate-300 border-l-4 border-transparent hover:bg-slate-800'
            }`}
          >
            <span className="w-8 text-right pr-3 text-slate-600 select-none text-xs leading-6">
              {idx + 1}
            </span>
            <pre className="flex-1 leading-6 whitespace-pre pl-1">
              {line}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};