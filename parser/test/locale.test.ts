import { describe, test, expect } from '@jest/globals';
import { parseRemark, readFile } from './helper';

describe('Parse simple 3md document', () => {
  test('parse simple inline separators - Sinhala', () => {
    const input = readFile('simple.input.3md');
    const actual = parseRemark(input, 'si');
    const expected = readFile('simple.output.si.md');

    expect(actual).toBe(expected);
  });

  test('parse simple inline separators - Tamil', () => {
    const input = readFile('simple.input.3md');
    const actual = parseRemark(input, 'ta');
    const expected = readFile('simple.output.ta.md');

    expect(actual).toBe(expected);
  });

  test('parse simple inline separators - English', () => {
    const input = readFile('simple.input.3md');
    const actual = parseRemark(input, 'en');
    const expected = readFile('simple.output.en.md');

    expect(actual).toBe(expected);
  });
});

describe('Parse block separator (෴) documents', () => {
  test('parse block separator - Sinhala', () => {
    const input = readFile('block-separator.input.3md');
    const actual = parseRemark(input, 'si');
    const expected = readFile('block-separator.output.si.md');

    expect(actual).toBe(expected);
  });

  test('parse block separator - English', () => {
    const input = readFile('block-separator.input.3md');
    const actual = parseRemark(input, 'en');
    const expected = readFile('block-separator.output.en.md');

    expect(actual).toBe(expected);
  });
});

describe('Parse without locale (all languages)', () => {
  test('parse without locale should keep all languages', () => {
    const input = `{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம~Introduction

කෙටි වාක්‍යය.~குறுகிய வாக்கியம்.~Short sentence.`;

    const actual = parseRemark(input);

    // Should contain all three language headings separated by spaces
    expect(actual).toContain('හැඳින්වීම அறிமுகம Introduction');
  });
});

describe('Language declaration validation', () => {
  test('should handle different language orders', () => {
    const input = `{{langs|en|si|ta}}

# Introduction~හැඳින්වීම~அறிமுகம

English first.~සිංහල දෙවන.~தமிழ் மூன்றாவது.`;

    const actualEn = parseRemark(input, 'en');
    expect(actualEn).toContain('Introduction');
    expect(actualEn).toContain('English first.');

    const actualSi = parseRemark(input, 'si');
    expect(actualSi).toContain('හැඳින්වීම');
    expect(actualSi).toContain('සිංහල දෙවන.');
  });
});
