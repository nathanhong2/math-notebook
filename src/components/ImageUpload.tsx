import { useRef } from 'react';

interface Props {
  label: string;
  image: string | null;
  onImage: (dataUrl: string | null) => void;
  accent?: 'violet' | 'rose';
}

export default function ImageUpload({ label, image, onImage, accent = 'violet' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => onImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }

  const border = accent === 'rose'
    ? 'border-rose-200 hover:border-rose-400 bg-rose-50'
    : 'border-violet-200 hover:border-violet-400 bg-violet-50';
  const text = accent === 'rose' ? 'text-rose-500' : 'text-violet-500';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {image ? (
        <div className={`relative rounded-xl overflow-hidden border-2 ${accent === 'rose' ? 'border-rose-200' : 'border-violet-200'}`}>
          <img src={image} alt={label} className="w-full object-contain max-h-80 bg-white" />
          <button
            onClick={() => onImage(null)}
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
