import { readFileSync } from 'fs';
import { join } from 'path';

const packageDir = process.argv[2];
if (!packageDir) {
  console.error('Usage: node generate-reference.mjs <packageDir>');
  process.exit(1);
}

const dtsPath = join(packageDir, 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq.d.ts');
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

const unique = Array.from(byKey.values());

// Group by module
const byModule = new Map();
for (const r of unique.sort((a, b) => a.module.localeCompare(b.module) || a.method.localeCompare(b.method))) {
  if (!byModule.has(r.module)) {
    byModule.set(r.module, []);
  }
  byModule.get(r.module).push(r);
}

// Output as markdown
console.log('## Reference');
console.log('');
console.log('Complete list of available faker categories and types.');

for (const [module, methods] of byModule) {
  console.log('');
  console.log('### ' + module);
  console.log('');
  console.log('<table>');
  console.log('<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>');

  for (const r of methods) {
    if (r.args.length === 0) {
      console.log(`<tr><td>${r.method}</td><td></td></tr>`);
    } else if (r.args.length === 1) {
      console.log(`<tr><td>${r.method}</td><td>${r.args[0]}</td></tr>`);
    } else {
      // Use rowspan for multiple args
      console.log(`<tr><td rowspan="${r.args.length}">${r.method}</td><td>${r.args[0]}</td></tr>`);
      for (let i = 1; i < r.args.length; i++) {
        console.log(`<tr><td>${r.args[i]}</td></tr>`);
      }
    }
  }

  console.log('</table>');
}

console.log('');
console.log('For more details, see the [Faker.js documentation](https://fakerjs.dev/api/).');
