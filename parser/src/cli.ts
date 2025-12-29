#!/usr/bin/env node

/**
 * CLI tool for 3md parser
 * Usage: 3md-split <input.3md> [output-basename]
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import { splitToFiles } from './splitter.js';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: 3md-split <input.3md> [output-basename]');
    console.error('');
    console.error('Examples:');
    console.error('  3md-split document.3md');
    console.error('  3md-split document.3md output');
    process.exit(1);
  }

  const inputPath = resolve(args[0]);
  const baseName =
    args[1] ||
    basename(inputPath)
      .replace(/\.3md$/, '')
      .replace(/\.md$/, '');

  console.log(`Reading: ${inputPath}`);

  try {
    const content = readFileSync(inputPath, 'utf-8');
    const result = await splitToFiles(content, baseName);

    const outputDir = dirname(inputPath);

    for (const file of result.files) {
      const outputPath = resolve(outputDir, file.filename);
      writeFileSync(outputPath, file.content, 'utf-8');
      console.log(`Created: ${outputPath}`);
    }

    console.log('');
    console.log('✓ Successfully split 3md document into 3 language files');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
