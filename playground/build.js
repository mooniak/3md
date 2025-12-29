#!/usr/bin/env node

/**
 * Build script for 3md playground
 * Copies parser source into the playground HTML file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PARSER_DIR = path.join(__dirname, '../parser/src');
const EXAMPLES_DIR = path.join(__dirname, '../spec/examples');
const PLAYGROUND_FILE = path.join(__dirname, 'index.html');

console.log('Building 3md playground...');

// Read the current playground file
let html = fs.readFileSync(PLAYGROUND_FILE, 'utf-8');

// Read example files
const examples = {};
const exampleFiles = fs.readdirSync(EXAMPLES_DIR).filter(f => f.endsWith('.3md'));

for (const file of exampleFiles) {
    const content = fs.readFileSync(path.join(EXAMPLES_DIR, file), 'utf-8');
    const name = file.replace('.3md', '');
    examples[name] = content;
}

// Inject examples as a JavaScript constant
const examplesJson = JSON.stringify(examples, null, 2);
const examplesInjection = `
        // Example files from spec/examples/
        const EXAMPLES = ${examplesJson};
`;

// Find the location to inject examples (after imports, before functions)
const importEnd = html.indexOf("import { visit } from 'https://esm.sh/unist-util-visit@5';");
if (importEnd === -1) {
    console.error('Could not find import statements in playground file');
    process.exit(1);
}

const nextLineAfterImports = html.indexOf('\n', importEnd) + 1;
const nextLineAfterImports2 = html.indexOf('\n', nextLineAfterImports) + 1;

// Remove old examples if they exist
const examplesStart = html.indexOf('// Example files from spec/examples/');
if (examplesStart !== -1) {
    const examplesEnd = html.indexOf('};', examplesStart) + 2;
    html = html.slice(0, examplesStart) + html.slice(examplesEnd);
}

// Inject new examples
html = html.slice(0, nextLineAfterImports2) + examplesInjection + html.slice(nextLineAfterImports2);

// Write back
fs.writeFileSync(PLAYGROUND_FILE, html, 'utf-8');

console.log(`✓ Built playground with ${exampleFiles.length} examples`);
console.log('  Examples:', exampleFiles.join(', '));
