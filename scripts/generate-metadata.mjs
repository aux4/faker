import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageDir = process.argv[2];
if (!packageDir) {
  console.error('Usage: node generate-metadata.mjs <packageDir>');
  process.exit(1);
}

const dtsPath = join(packageDir, 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq.d.ts');
const dtsContent = readFileSync(dtsPath, 'utf-8');

const results = [];
let currentModule = '';

const lines = dtsContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const moduleMatch = line.match(/declare class (\w+)Module/);
  if (moduleMatch) {
    currentModule = moduleMatch[1].toLowerCase();
    if (currentModule === 'simpledate') currentModule = 'date';
    if (currentModule === 'simplehelpers') currentModule = 'helpers';
    if (currentModule === 'simplelocation') currentModule = 'location';
    continue;
  }

  const methodMatch = line.match(/^\s{4}(\w+)\(/);
  if (methodMatch && currentModule && !line.includes('private') && !line.includes('constructor')) {
    const methodName = methodMatch[1];

    if (methodName.startsWith('_') ||
        methodName === 'getMetadata' ||
        methodName === 'next' ||
        methodName === 'seed' ||
        methodName === 'setDefaultRefDate') continue;

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

// Deduplicate
const byKey = new Map();
for (const r of results) {
  const key = r.module + '.' + r.method;
  const existing = byKey.get(key);
  if (!existing || r.args.length > existing.args.length) {
    byKey.set(key, r);
  }
}

const metadata = Array.from(byKey.values());

const outputPath = join(packageDir, 'package/lib/faker-metadata.json');
writeFileSync(outputPath, JSON.stringify(metadata));
console.log(`Generated ${outputPath} with ${metadata.length} entries`);
