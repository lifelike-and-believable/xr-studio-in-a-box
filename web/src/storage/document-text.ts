import 'server-only';
import { strFromU8, unzipSync } from 'fflate';
import { extractText } from 'unpdf';

// The kind of a stored file, read from its first bytes rather than its name or the type the
// browser declared (layer1-facts-identifiers-activity#AC-11, AC-25).
export type SampleKind = 'pdf' | 'docx' | 'image' | 'video' | 'audio' | null;

const starts = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((b, i) => bytes[offset + i] === b);
const ascii = (bytes: Uint8Array, text: string, offset = 0) => starts(bytes, [...text].map((c) => c.charCodeAt(0)), offset);

export function kindOf(head: Uint8Array, mediaType: string): SampleKind {
  if (ascii(head, '%PDF-')) return 'pdf';
  if (starts(head, [0x50, 0x4b, 0x03, 0x04])) return 'docx';
  if (starts(head, [0x89, 0x50, 0x4e, 0x47]) || starts(head, [0xff, 0xd8, 0xff]) || ascii(head, 'GIF8')) return 'image';
  if (ascii(head, 'RIFF') && ascii(head, 'WEBP', 8)) return 'image';
  if (ascii(head, 'RIFF') && ascii(head, 'WAVE', 8)) return 'audio';
  if (ascii(head, 'II*\0') || ascii(head, 'MM\0*')) return 'image';
  if (ascii(head, 'ftyp', 4)) {
    const brand = String.fromCharCode(...head.slice(8, 12));
    if (/^(heic|heix|mif1|avif)/.test(brand)) return 'image';
    if (/^M4A/.test(brand) || mediaType.startsWith('audio/')) return 'audio';
    return 'video';
  }
  if (starts(head, [0x1a, 0x45, 0xdf, 0xa3])) return mediaType.startsWith('audio/') ? 'audio' : 'video';
  if (ascii(head, 'ID3') || starts(head, [0xff, 0xfb]) || starts(head, [0xff, 0xf3]) || starts(head, [0xff, 0xf1])) return 'audio';
  if (ascii(head, 'OggS')) return mediaType.startsWith('video/') ? 'video' : 'audio';
  if (ascii(head, 'fLaC')) return 'audio';
  return null;
}

// The text of each PDF page; a scanned PDF gives empty pages.
export async function pdfPages(bytes: Uint8Array): Promise<string[]> {
  const { text } = await extractText(bytes);
  return text;
}

const WORD_PARTS = /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/;

const decodeXml = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');

// The text of a Word document's body, headers, footers, footnotes and endnotes, from its w:t
// elements, one paragraph per line. Null when the zip holds no word/document.xml.
export function docxText(bytes: Uint8Array): string | null {
  let files;
  try {
    files = unzipSync(bytes, { filter: (file) => WORD_PARTS.test(file.name) });
  } catch {
    return null;
  }
  if (!files['word/document.xml']) return null;
  return Object.values(files)
    .map((data) =>
      strFromU8(data)
        .split(/<\/w:p>/)
        .map((p) => [...p.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((m) => decodeXml(m[1] ?? '')).join(''))
        .join('\n'),
    )
    .join('\n');
}
