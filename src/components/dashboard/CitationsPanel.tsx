'use client';

import { useMemo } from 'react';
import type { CitationAttachment } from '@/types/chat';
import { Book, X } from 'lucide-react';

interface Props {
  readonly citations: CitationAttachment[];
  readonly isVisible: boolean;
  readonly onClose?: () => void;
}

export default function CitationsPanel({ citations, isVisible, onClose }: Props) {
  const sorted = useMemo(
    () => [...citations].sort((a, b) => a.key.localeCompare(b.key)),
    [citations],
  );

  const cleanReference = (reference: string): string => {
    return reference.replace(/\.\s*Retrieved from\s+https?:\/\/[^\s]+$/i, '.').trim();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="flex h-full w-80 flex-col border-l border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <Book size={20} className="text-gray-600" />
          <div>
            <h2 className="text-lg font-semibold">References</h2>
            <p className="text-sm text-gray-500">
              {sorted.length} {sorted.length === 1 ? 'source' : 'sources'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            type="button"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sorted.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Book size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">No references yet</p>
              <p className="text-xs text-gray-500">Citations will appear as you research</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((item) => (
              <div
                key={item.key}
                id={`citation-${item.key}`}
                className="scroll-mt-4"
              >
                {item.citation.url ? (
                  
                  <a
                    href={item.citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="citation-text block transition-colors"
                  >
                    {cleanReference(item.reference)}
                  </a>
                ) : (
                  <p className="citation-text">
                    {cleanReference(item.reference)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}