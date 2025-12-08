import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedMetadata = null;

function getMetadata() {
  if (!cachedMetadata) {
    const metadataPath = join(__dirname, 'faker-metadata.json');
    cachedMetadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
  }
  return cachedMetadata;
}

export function getCategories() {
  const metadata = getMetadata();
  const categories = [...new Set(metadata.map(m => m.module))];
  return categories.sort();
}

export function getTypesForCategory(category) {
  const metadata = getMetadata();
  return metadata
    .filter(m => m.module === category)
    .sort((a, b) => a.method.localeCompare(b.method));
}
