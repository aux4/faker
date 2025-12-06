import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageDir = process.argv[2];
if (!packageDir) {
  console.error('Usage: node update-readme.mjs <packageDir>');
  process.exit(1);
}

const readmePath = join(packageDir, 'package/README.md');
const referencePath = join(packageDir, 'package/reference.md');

const readme = readFileSync(readmePath, 'utf-8');
const reference = readFileSync(referencePath, 'utf-8');

const startMarker = '## Reference';
const endMarker = '## License';

const startIndex = readme.indexOf(startMarker);
const endIndex = readme.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in README.md');
  process.exit(1);
}

const before = readme.substring(0, startIndex);
const after = readme.substring(endIndex);

const newReadme = before + reference + '\n' + after;

writeFileSync(readmePath, newReadme);
console.log('README.md updated successfully');
