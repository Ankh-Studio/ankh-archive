---
trigger: always_on
---


# Windsurf IDE Rules for Obsidian Web Clipper

## Project Context
This is a TypeScript-based browser extension for Obsidian that allows users to clip web content. The extension supports Chrome, Firefox, and Safari browsers and uses a manager-based architecture with utility functions.

## Code Style and Conventions

### TypeScript Guidelines
- Use explicit return types for all public functions
- Prefer interfaces over type aliases for object shapes
- Use named exports instead of default exports
- Follow kebab-case for file names, PascalCase for types/interfaces
- Use async/await instead of Promise chains
- Always handle errors with try-catch blocks and meaningful error messages

### File Organization
- Place business logic in `src/managers/` directory
- Place shared utilities in `src/utils/` directory
- Group related functionality (filters in `src/utils/filters/`)
- Use index files sparingly, prefer explicit imports
- Keep types centralized in `src/types/types.ts`

### Browser Extension Patterns
- Use the browser polyfill from `src/utils/browser-polyfill.ts`
- Follow the existing storage patterns in `src/utils/storage-utils.ts`
- Use the message passing patterns established in the codebase
- Maintain cross-browser compatibility (Chrome, Firefox, Safari)

### UI Component Patterns
- Use vanilla TypeScript, no frameworks
- Follow BEM CSS methodology for styling
- Use SCSS variables from `src/styles/_variables.scss`
- Implement modal patterns using existing modal utilities
- Use event delegation for dynamic content

## Architecture Patterns

### Manager Classes
- Create manager classes for complex feature areas
- Use dependency injection for shared utilities
- Implement proper cleanup methods
- Follow the existing manager patterns (TemplateManager, CrawlManager)

### Utility Functions
- Make utilities pure functions when possible
- Use proper TypeScript generics for reusable utilities
- Follow the filter pattern for template transformations
- Implement proper error handling and validation

### Storage Management
- Use the `generalSettings` object pattern for configuration
- Implement auto-save with debouncing for user input
- Use LZ-String compression for large data structures
- Follow the existing storage key conventions

## Performance Guidelines

### Memory Management
- Remove event listeners on cleanup
- Avoid creating unnecessary DOM elements
- Use throttling/debouncing for frequent operations
- Clean up async operations properly

### Async Operations
- Use proper cancellation for long-running operations
- Implement progress callbacks for user feedback
- Handle network failures gracefully
- Use sequential processing to avoid overwhelming servers

## Browser Extension Specifics

### Manifest and Permissions
- Only request necessary permissions
- Use the existing manifest patterns for cross-browser support
- Implement proper background script patterns
- Follow content script injection patterns

### Content Script Integration
- Use the existing content extraction patterns
- Implement proper page state detection
- Handle dynamic content and SPAs
- Use secure content sanitization

### Cross-browser Compatibility
- Test on Chrome, Firefox, and Safari
- Use the browser polyfill for API differences
- Handle browser-specific manifest requirements
- Account for mobile Safari limitations

## Internationalization

### Message Handling
- Add new strings to all locale files in `src/_locales/`
- Use descriptive message keys
- Support RTL languages properly
- Use placeholder patterns for dynamic content

### Localization Patterns
- Use the `getMessage()` utility from `src/utils/i18n.ts`
- Implement proper text direction handling
- Support cultural formatting differences
- Test with multiple languages

## Security Considerations

### Content Security
- Use DOMPurify for HTML sanitization
- Validate all user inputs
- Sanitize URLs and file paths
- Use secure communication patterns

### Extension Security
- Follow principle of least privilege
- Validate all message passing
- Secure storage of sensitive data
- Implement proper CSP headers

## Development Workflow

### Build System
- Use the existing Webpack configuration
- Support hot reloading during development
- Maintain separate builds for each browser
- Follow the existing script patterns in package.json

### Code Quality
- Use ESLint configuration provided
- Follow TypeScript strict mode rules
- Maintain consistent formatting with EditorConfig
- Write descriptive commit messages

## File Modification Guidelines
- Always maintain backward compatibility
- Update related files when making changes
- Follow the existing import/export patterns
- Update internationalization strings when adding UI
- Test changes across all supported browsers
- Update documentation when adding new features

## Dependencies and Libraries
- Use existing dependencies when possible
- Prefer lightweight alternatives
- Ensure browser compatibility
- Update package.json only when necessary
- Use the existing polyfills and utilities

## When Adding New Features
1. Check if similar functionality exists
2. Follow the existing architectural patterns
3. Add proper TypeScript types
4. Implement internationalization support
5. Add error handling and validation
6. Test across all supported browsers
7. Update relevant documentation
8. Consider performance implications