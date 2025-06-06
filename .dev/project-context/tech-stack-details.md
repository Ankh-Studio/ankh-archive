
# Technology Stack Details

## Core Technologies

### TypeScript Configuration
- **Version**: 5.5.4+
- **Target**: ES2020
- **Module**: ESNext
- **Strict Mode**: Enabled
- **Declaration Files**: Custom types in `src/types/`

### Build System - Webpack 5
- **Multi-target**: Chrome, Firefox, Safari
- **Development**: Watch mode with source maps
- **Production**: Minification with Terser
- **Asset Processing**: File copying and SCSS compilation
- **Environment Variables**: Browser-specific builds

### Browser Extension APIs
- **WebExtension Polyfill**: Mozilla's compatibility layer
- **Permissions**: tabs, storage, contextMenus, sidePanel
- **Background Scripts**: Service workers (Chrome) / Event pages (Firefox)
- **Content Scripts**: DOM manipulation and content extraction

## Frontend Technologies

### Styling System
- **Preprocessor**: Sass/SCSS
- **Architecture**: Component-based modules
- **Variables**: CSS custom properties
- **Responsive**: Mobile-first approach
- **Browser Support**: Modern browsers with fallbacks

### UI Components
- **Framework**: Vanilla TypeScript (no framework)
- **State Management**: Custom event system
- **Modals**: Custom overlay system
- **Form Handling**: Native HTML5 validation
- **Drag & Drop**: HTML5 APIs

## Content Processing

### HTML to Markdown Conversion
- **Primary**: Turndown library
- **Plugins**: GitHub Flavored Markdown (GFM)
- **Custom Rules**: Obsidian-specific formatting
- **Sanitization**: DOMPurify for security

### Template Engine
- **Syntax**: Handlebars-like `{{variable}}`
- **Filters**: 50+ transformation functions
- **Variables**: Dynamic content extraction
- **Compilation**: Runtime template processing

### Content Extraction
- **Library**: Defuddle (custom extraction engine)
- **Selectors**: CSS selector-based targeting
- **Readability**: Article content detection
- **Media**: Image and link processing

## Data Management

### Storage Architecture
- **Browser Storage**: Extension storage APIs
- **Compression**: LZ-String for large data
- **Sync**: Cross-device settings synchronization
- **Persistence**: Local storage with cloud backup

### Settings System
- **Structure**: Nested configuration objects
- **Validation**: Runtime type checking
- **Migration**: Version-based upgrades
- **Export/Import**: JSON-based data exchange

## Browser Integration

### Cross-Platform Support
- **Chrome**: Full feature set with sidePanel
- **Firefox**: Background page compatibility
- **Safari**: Xcode project integration
- **Mobile**: iOS Safari support

### Obsidian Integration
- **Protocol**: obsidian:// URI scheme
- **Methods**: Direct URL navigation
- **Clipboard**: Content transfer mechanism
- **Properties**: Obsidian property type system

## Development Tools

### Code Quality
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Static type checking
- **EditorConfig**: Consistent formatting
- **Git Hooks**: Pre-commit validation

### Internationalization
- **System**: Browser extension i18n APIs
- **Coverage**: 25+ languages
- **RTL Support**: Arabic, Hebrew, Farsi
- **Pluralization**: ICU message format

### Testing Strategy
- **Manual Testing**: Cross-browser validation
- **Console Logging**: Comprehensive error tracking
- **User Feedback**: GitHub issues and help docs
- **Performance**: Memory and network monitoring

## Security Considerations

### Content Security
- **Sanitization**: DOMPurify for HTML cleaning
- **Permissions**: Minimal required permissions
- **Data Privacy**: Local-only storage
- **Cross-Origin**: Secure content extraction

### Extension Security
- **Manifest V3**: Modern security model (Chrome)
- **Content Scripts**: Isolated execution context
- **Background Scripts**: Minimal privilege principle
- **API Access**: Scoped permissions only
