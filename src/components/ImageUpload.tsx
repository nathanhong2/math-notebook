import { useRef, useState } from 'react';
import { runOCR } from '../ocr';

interface Props {
  label: string;
  image: string | null;
  ocrText: string | null;
  onImage: (dataUrl: string | null) => void;
  onOcrText: (text: string | null) => void;
  apiKey: string;
  accent?: 'violet' | 'rose';
}

export default function ImageUpload({ label, image, ocrText, onImage, onOcrText, apiKey, accent = 'violet' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);

  async function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      onImage(dataUrl);
      setError(null);

      if (!apiKey) return;

      setLoading(true);
      try {
        const text = await runOCR(dataUrl, apiKey);
        onOcrText(text || null);
        if (text) setShowText(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'OCR failed');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }

  function handleRemove() {
    onImage(null);
    onOcrText(null);
    setError(null);
    setShowText(false);
  }

  const border = accent === 'rose'
    ? 'border-rose-200 hover:border-rose-400 bg-rose-50'
    : 'border-violet-200 hover:border-violet-400 bg-violet-50';
  const text = accent === 'rose' ? 'text-rose-500' : 'text-violet-500';
  const imageBorder = accent === 'rose' ? 'border-rose-200' : 'border-violet-200';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {image ? (
        <div className="space-y-2">
          <div className={`relative rounded-xl overflow-hidden border-2 ${imageBorder}`}>
            <img src={image} alt={label} className="w-full object-contain max-h-80 bg-white" />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors"
              title="Remove image"
            >
              ✕
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg px-2 py-1 transition-colors"
            >
              Replace
            </button>
            {loading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white rounded-xl px-4 py-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Reading text...
                </div>
              </div>
            )}
          </div>

          {/* OCR result */}
          {error && (
            <p className="text-xs text-red-400 px-1">{error}</p>
          )}
          {ocrText && !loading && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
              <button
                onClick={() => setShowText(!showText)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <span>📄</span> Extracted text
                </span>
                <span>{showText ? '▲' : '▼'}</span>
              </button>
              {showText && (
                <p className="px-3 pb-3 text-xs text-gray-600 whitespace-pre-wrap border-t border-gray-100 pt-2">
                  {ocrText}
                </p>
              )}
            </div>
          )}
          {!apiKey && !loading && (
            <p className="text-xs text-gray-400 px-1">Set your API key to enable automatic text extraction.</p>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${border}`}
        >
          <p className="text-3xl mb-2">📷</p>
          <p className={`text-sm font-medium ${text}`}>Click or drag an image here</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, HEIC supported</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
