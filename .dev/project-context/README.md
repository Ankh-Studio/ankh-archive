
# Obsidian Web Clipper - Project Context

## Project Overview

Obsidian Web Clipper is the official browser extension for Obsidian that allows users to save web content in a private and durable Markdown format. The extension supports highlighting, templating, and intelligent content extraction across Chrome, Firefox, and Safari browsers.

## Key Features

- **Web Content Clipping**: Extract and save web pages as Markdown files
- **Highlighting System**: Select and highlight specific content on web pages
- **Template Engine**: Customizable templates with variables and filters
- **Multi-browser Support**: Chrome, Firefox, and Safari compatibility
- **Interpreter**: AI-powered content extraction using natural language prompts
- **Cross-platform**: Desktop and mobile browser support
- **Offline Access**: Content saved locally to Obsidian vaults

## Technology Stack

- **Language**: TypeScript
- **Build System**: Webpack 5
- **Styling**: SCSS/Sass
- **Browser APIs**: WebExtensions API with polyfill
- **Content Processing**: Turndown (HTML to Markdown conversion)
- **Date Handling**: Day.js
- **Content Extraction**: Defuddle library
- **Compression**: LZ-String for template storage
- **Sanitization**: DOMPurify for HTML cleaning

## Architecture

### Extension Structure
- **Background Script**: Context menus, tab management
- **Content Scripts**: Page content extraction and DOM manipulation
- **Popup Interface**: Main user interface in browser toolbar
- **Side Panel**: Extended interface for complex operations
- **Settings Page**: Configuration and template management

### Core Managers
- **Template Manager**: Handle template CRUD operations
- **Crawl Manager**: Multi-URL processing (planned feature)
- **Highlights Manager**: Content highlighting functionality
- **Storage Manager**: Settings and data persistence

### Integration Points
- **Obsidian Protocol**: Direct vault integration via obsidian:// URLs
- **Clipboard API**: Content transfer mechanism
- **Browser Storage**: Extension settings and templates
- **Cross-tab Communication**: Background script coordination

## Development Status

The project is actively maintained with regular releases. Current version focuses on core clipping functionality with ongoing development of advanced features like multi-URL crawling and enhanced AI interpretation.
