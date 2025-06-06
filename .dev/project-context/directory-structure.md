
# Directory Structure Guide

## Root Level
```
obsidian-clipper/
├── .dev/                    # Development planning and documentation
├── .github/                 # GitHub templates and funding info
├── assets/                  # Browser store assets and screenshots
├── docs/                    # User documentation in Markdown
├── scripts/                 # Build and maintenance scripts
├── src/                     # Main source code
├── xcode/                   # Safari extension Xcode project
└── webpack.config.js        # Build configuration
```

## Source Code Structure (`src/`)

### Core Application (`src/core/`)
- `popup.ts` - Main popup interface logic
- `settings.ts` - Settings page functionality

### Managers (`src/managers/`)
Business logic and feature coordination:
- `template-manager.ts` - Template CRUD operations
- `template-ui.ts` - Template interface components
- `crawl-manager.ts` - Multi-URL processing engine
- `highlights-manager.ts` - Content highlighting system
- `general-settings.ts` - Application settings
- `interpreter-settings.ts` - AI prompt configuration
- `property-types-manager.ts` - Obsidian property types

### Utilities (`src/utils/`)
Shared functionality and helpers:

#### Content Processing
- `content-extractor.ts` - Web page content extraction
- `markdown-converter.ts` - HTML to Markdown conversion
- `template-compiler.ts` - Template variable processing
- `obsidian-note-creator.ts` - Obsidian integration

#### Filters (`src/utils/filters/`)
Template variable transformations (50+ filters):
- Text manipulation (capitalize, lower, upper, trim)
- Data formatting (date, number_format, duration)
- Content processing (markdown, remove_html, blockquote)
- Structure operations (list, table, join, split)

#### Browser Integration
- `browser-polyfill.ts` - Cross-browser compatibility
- `storage-utils.ts` - Extension storage management
- `active-tab-manager.ts` - Tab interaction
- `highlighter.ts` - Page highlighting functionality

### Styling (`src/styles/`)
SCSS modules for component styling:
- `_variables.scss` - Design system variables
- `popup.scss` - Main interface styles
- `settings.scss` - Settings page styles
- `modals.scss` - Modal dialog styles
- Component-specific styles (buttons, inputs, dropdowns)

### Internationalization (`src/_locales/`)
Translation files for 25+ languages:
- Each language has its own folder (en, es, fr, de, etc.)
- `messages.json` contains all UI strings
- Supports RTL languages (Arabic, Hebrew)

### Browser Manifests
- `manifest.chrome.json` - Chrome/Chromium browsers
- `manifest.firefox.json` - Firefox browser
- `manifest.safari.json` - Safari browser

## Key File Relationships

### Template System Flow
1. `template-manager.ts` - Data management
2. `template-ui.ts` - User interface
3. `template-compiler.ts` - Variable processing
4. `filters/` - Content transformation
5. `obsidian-note-creator.ts` - Final output

### Content Extraction Flow
1. `content.ts` - Content script injection
2. `content-extractor.ts` - Page analysis
3. `markdown-converter.ts` - Format conversion
4. `highlighter.ts` - User selections
5. `storage-utils.ts` - Data persistence

### Browser Extension Lifecycle
1. `background.ts` - Extension initialization
2. `popup.ts` - User interaction
3. `content.ts` - Page integration
4. `browser-polyfill.ts` - API abstraction
