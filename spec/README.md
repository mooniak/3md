# 3md Specification

This directory contains the official specification documents for the 3md (Trilingual Markdown) format.

## Specification Documents

### [SPEC.md](SPEC.md)
The complete 3md format specification defining:
- Language declaration syntax
- The two separator types (inline `~` and block `෴`)
- Markdown integration
- Metadata and frontmatter
- Complete syntax reference

This is the canonical reference for implementing 3md parsers and tools.

### [ERRORS.md](ERRORS.md)
Error handling specification defining:
- Validation rules
- Error codes and messages
- Parser behavior for invalid input
- Recovery strategies

Follow this spec when implementing error reporting in 3md tools.

### [IMPLEMENTATION.md](IMPLEMENTATION.md)
Implementation guidelines for tool builders:
- Recommended parsing strategies
- Edge cases and considerations
- Best practices for converter tools
- Testing recommendations

## Canonical Examples

The [examples/](examples/) directory contains canonical 3md documents that demonstrate the format and serve as test cases:

- **[simple-inline.3md](examples/simple-inline.3md)** - Basic inline separators (~)
- **[block-separator.3md](examples/block-separator.3md)** - Block separators (෴) with multi-line content
- **[mixed.3md](examples/mixed.3md)** - Mixed inline and block separators
- **[colombo.3md](examples/colombo.3md)** - Comprehensive real-world example about Colombo city
- **[minimal.3md](examples/minimal.3md)** - Minimal valid 3md document

Each example includes the original `.3md` file and the expected output as separate language files (`.si.md`, `.ta.md`, `.en.md`).

All 3md implementations should correctly parse these examples.

## Specification Status

**Current Version:** 0.1.0
**Status:** Draft
**Last Updated:** 2025-12-29

The specification is under active development. Breaking changes may occur before version 1.0.0.

## Implementation Conformance

A conforming 3md implementation must:

1. Correctly parse the language declaration `{{langs|si|ta|en}}`
2. Handle inline separators (~) in headings, paragraphs, and list items
3. Handle block separators (෴) for multi-line content
4. Preserve markdown formatting in extracted language content
5. Follow error handling rules defined in ERRORS.md
6. Pass all canonical examples in the examples/ directory

## Contributing

To propose changes to the specification:

1. Open an issue describing the problem or use case
2. Discuss the proposed change with maintainers
3. Submit a pull request with specification updates
4. Update canonical examples if syntax changes

## License

The 3md specification is released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

You are free to:
- Implement the specification in any software
- Use 3md files for any purpose
- Build tools and services around 3md
- Modify and adapt the specification with attribution

## Related Documents

- [Root README](../README.md) - Overview of 3md and use cases
- [Parser Implementation](../parser/README.md) - Reference TypeScript parser
- [Documentation](../docs/) - Additional guides and articles
