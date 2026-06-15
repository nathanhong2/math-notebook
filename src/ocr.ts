export async function runOCR(dataUrl: string, apiKey: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob();
  const form = new FormData();
  form.append('document', blob, 'image.jpg');
  form.append('model', 'ocr');

  const res = await fetch('https://api.upstage.ai/v1/document-digitization', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `OCR failed (${res.status})`);
  }

  const data = await res.json();
  return data.text ?? '';
}
