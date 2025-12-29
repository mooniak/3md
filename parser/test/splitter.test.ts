import { describe, test, expect } from '@jest/globals';
import { splitToLanguageFiles } from '../src/splitter';
import { readFile } from './helper';

describe('Split 3md to language files', () => {
  test('split simple document to three files', async () => {
    const input = readFile('simple.input.3md');
    const result = await splitToLanguageFiles(input);

    expect(result.si).toBeTruthy();
    expect(result.ta).toBeTruthy();
    expect(result.en).toBeTruthy();

    // Check Sinhala output
    expect(result.si).toContain('හැඳින්වීම');
    expect(result.si).toContain('කෙටි වාක්‍යය.');

    // Check Tamil output
    expect(result.ta).toContain('அறிமுகம');
    expect(result.ta).toContain('குறுகிய வாக்கியம்.');

    // Check English output
    expect(result.en).toContain('Introduction');
    expect(result.en).toContain('Short sentence.');
  });

  test('split block separator document', async () => {
    const input = readFile('block-separator.input.3md');
    const result = await splitToLanguageFiles(input);

    // Check Sinhala output
    expect(result.si).toContain('මෙය දිගු ඡේදයකි.');

    // Check English output
    expect(result.en).toContain('This is a longer paragraph.');
  });
});
