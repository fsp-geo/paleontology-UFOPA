import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';

const STITCH_DIR = path.join(process.cwd(), 'public', 'stitch');

function extractTagContents(source: string, tagName: string) {
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const matches = [...source.matchAll(pattern)];
  return matches.map((match) => match[1]?.trim()).filter(Boolean) as string[];
}

function extractMainContent(source: string) {
  const match = source.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

  if (!match?.[1]) {
    throw new Error('Unable to locate <main> content in student Stitch page.');
  }

  return match[1].trim();
}

function stripFirstHeader(content: string) {
  return content.replace(/^\s*<header[\s\S]*?<\/header>\s*/i, '').trim();
}

function normalizeStyles(styles: string[]) {
  return styles
    .map((style) => style.trim())
    .filter(Boolean)
    .join('\n');
}

export const getStudentStitchPage = cache(async (fileName: string) => {
  const fullPath = path.join(STITCH_DIR, fileName);
  const source = await readFile(fullPath, 'utf8');

  return {
    content: stripFirstHeader(extractMainContent(source)),
    styles: normalizeStyles(extractTagContents(source, 'style')),
  };
});
