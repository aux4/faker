import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function findDtsPath() {
  // Try relative to lib/ (development)
  let dtsPath = join(__dirname, '../node_modules/@faker-js/faker/dist/airline-DF6RqYmq.d.ts');
  if (existsSync(dtsPath)) return dtsPath;

  // Try relative to package/lib/ (bundled in package)
  dtsPath = join(__dirname, '../../node_modules/@faker-js/faker/dist/airline-DF6RqYmq.d.ts');
  if (existsSync(dtsPath)) return dtsPath;

  throw new Error('Could not find faker.js type definitions');
}

function parseFakerTypes() {
  const dtsPath = findDtsPath();
  const dtsContent = readFileSync(dtsPath, 'utf-8');

  const results = [];
  let currentModule = '';

  const lines = dtsContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for module class
    const moduleMatch = line.match(/declare class (\w+)Module/);
    if (moduleMatch) {
      currentModule = moduleMatch[1].toLowerCase();
      // Normalize module names
      if (currentModule === 'simpledate') currentModule = 'date';
      if (currentModule === 'simplehelpers') currentModule = 'helpers';
      if (currentModule === 'simplelocation') currentModule = 'location';
      continue;
    }

    // Check for method definition
    const methodMatch = line.match(/^\s{4}(\w+)\(/);
    if (methodMatch && currentModule && !line.includes('private') && !line.includes('constructor')) {
      const methodName = methodMatch[1];

      // Skip internal/utility methods
      if (methodName.startsWith('_') ||
          methodName === 'getMetadata' ||
          methodName === 'next' ||
          methodName === 'seed' ||
          methodName === 'setDefaultRefDate') continue;

      // Look at the next lines to find options object properties
      const args = [];
      let inOptionsObject = false;
      let braceCount = 0;

      for (let j = i; j < Math.min(lines.length, i + 30); j++) {
        const nextLine = lines[j];

        braceCount += (nextLine.match(/{/g) || []).length;
        braceCount -= (nextLine.match(/}/g) || []).length;

        if (nextLine.includes('options?:') || nextLine.includes('options:')) {
          inOptionsObject = true;
        }

        if (inOptionsObject && braceCount > 0) {
          const propMatch = nextLine.match(/^\s{8,}(\w+)\??:/);
          if (propMatch && !propMatch[1].startsWith('_')) {
            args.push(propMatch[1]);
          }
        }

        if (braceCount === 0 && j > i && nextLine.includes('):')) {
          break;
        }

        if (j > i && nextLine.match(/^\s{4}\w+\(/)) {
          break;
        }
      }

      results.push({
        module: currentModule,
        method: methodName,
        args: [...new Set(args)]
      });
    }
  }

  // Deduplicate - keep the one with most args
  const byKey = new Map();
  for (const r of results) {
    const key = r.module + '.' + r.method;
    const existing = byKey.get(key);
    if (!existing || r.args.length > existing.args.length) {
      byKey.set(key, r);
    }
  }

  return Array.from(byKey.values());
}

let cachedMetadata = null;

function getMetadata() {
  if (!cachedMetadata) {
    cachedMetadata = parseFakerTypes();
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
