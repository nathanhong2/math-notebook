import type { Question } from '../types';

interface Props {
  questions: Question[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export default function Sidebar({ questions, selectedId, onSelect, onNew, onDelete, hasApiKey, onOpenSettings }: Props) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📐</span>
          <h1 className="font-bold text-gray-900 text-lg">Math Notebook</h1>
        </div>
        <button
          onClick={onNew}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-base">+</span> New Question
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {questions.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8 px-4">
            No questions yet. Add one to get started!
          </p>
        )}
        {questions.map((q) => {
          const done = q.practices.filter(Boolean).length;
          const isSelected = q.id === selectedId;
          return (
            <div
              key={q.id}
              onClick={() => onSelect(q.id)}
              className={`group relative rounded-lg p-3 mb-1 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-violet-50 border border-violet-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${isSelected ? 'text-violet-900' : 'text-gray-800'}`}>
                    {q.title || 'Untitled Question'}
                  </p>
                  {q.subject && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{q.subject}</p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(q.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition-opacity shrink-0 mt-0.5"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {q.practices.map((checked, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                      checked
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-200'
                    }`}
                  >
                    {checked && <span className="text-white text-xs leading-none">✓</span>}
                  </div>
                ))}
                <span className="text-xs text-gray-400 ml-1">{done}/5</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings footer */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>⚙️</span>
          <span>API Key</span>
          <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${hasApiKey ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            {hasApiKey ? 'set' : 'not set'}
          </span>
        </button>
      </div>
    </aside>
  );
}
