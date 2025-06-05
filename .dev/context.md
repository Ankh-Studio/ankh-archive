
# Codebase Context for Multi-URL Crawl Feature

## Existing Infrastructure

### CrawlManager (`src/managers/crawl-manager.ts`)
- **Status**: Already implemented but not UI-integrated
- **Key Methods**:
  - `crawlUrls(urls, template, onProgress)` - Core crawl functionality
  - Progress callback system already in place
  - Error handling and results tracking
- **Integration Point**: Ready for UI integration

### Template System
- **Files**: `src/managers/template-ui.ts`, `src/managers/template-manager.ts`
- **Components**: Template dropdown, property management
- **Integration**: Reuse existing template selection logic

### Obsidian Integration (`src/utils/obsidian-note-creator.ts`)
- **Functions**: `createObsidianNote()`, `saveToObsidian()`
- **Status**: Complete, handles all note creation scenarios
- **Integration**: Already used by CrawlManager

### Storage System (`src/utils/storage-utils.ts`)
- **Pattern**: generalSettings object with persistence
- **Usage**: Template preferences, vault settings
- **Extension**: Add crawl-specific settings

### UI Components
- **Popup**: `src/core/popup.ts`, `src/popup.html`
- **Side Panel**: `src/side-panel.html`
- **Modals**: Existing modal patterns in codebase
- **Styling**: SCSS structure in `src/styles/`

## Browser Extension Architecture

### Manifests
- **Chrome**: `src/manifest.chrome.json` - Has sidePanel permission
- **Firefox**: `src/manifest.firefox.json` - Background scripts
- **Safari**: `src/manifest.safari.json` - Service worker

### Background Script (`src/background.ts`)
- **Current**: Context menu for highlighting
- **Extension**: Add crawl context menu options

### Content Scripts (`src/content.ts`)
- **Current**: Page content extraction
- **Usage**: Reuse for crawl functionality

## UI/UX Patterns

### Existing Modals
- **Import/Export**: Modal overlay patterns
- **Settings**: Section-based navigation
- **Progress**: Loading indicators and status displays

### Button Placement Analysis
- **Popup**: Limited space, hierarchical importance
- **Side Panel**: More space, persistent access
- **Context Menu**: Quick access from any page

### Design System
- **Colors**: CSS variables in `_variables.scss`
- **Components**: Button styles, form inputs, progress bars
- **Responsive**: Mobile-friendly patterns

## Integration Points

### Settings Integration
- **File**: `src/settings.html` - Already has crawl UI elements (unused)
- **Approach**: Move from settings to main interface
- **Storage**: Extend generalSettings for crawl preferences

### Internationalization
- **Files**: `src/_locales/*/messages.json`
- **Existing**: Crawl-related strings already present
- **Usage**: `getMessage()` function for localization

### Error Handling
- **Pattern**: Console logging with user notifications
- **Extension**: Add crawl-specific error types
- **Recovery**: Retry mechanisms and progress restoration

## Dependencies

### External Libraries
- **Turndown**: Markdown conversion (already included)
- **Browser Polyfill**: Cross-browser compatibility
- **DOMPurify**: Content sanitization

### Build System
- **Webpack**: Configuration in `webpack.config.js`
- **TypeScript**: Configuration in `tsconfig.json`
- **SCSS**: Sass compilation for styles

## Performance Considerations

### Memory Usage
- **URL Limit**: 100 URLs max to prevent memory issues
- **Progress Storage**: Efficient state management
- **Cleanup**: Proper resource cleanup after crawl

### Network Requests
- **Sequential**: Prevent overwhelming target servers
- **Throttling**: Built into existing CrawlManager
- **Error Handling**: Graceful failure handling
