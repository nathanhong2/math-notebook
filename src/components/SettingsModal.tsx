import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export default function SettingsModal({ onClose, onSave, currentKey }: Props) {
  const [value, setValue] = useState(currentKey);

  function handleSave() {
    onSave(value.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold text-gray-900 text-lg mb-1">Upstage API Key</h2>
        <p className="text-sm text-gray-500 mb-4">
          Required for OCR. Stored in your browser only — never sent to GitHub.
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="up_xxxxxxxxxxxxxxxxxxxx"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 mb-4"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
        {currentKey && (
          <button
            onClick={() => { onSave(''); onClose(); }}
            className="w-full mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Remove key
          </button>
        )}
      </div>
    </div>
  );
}
