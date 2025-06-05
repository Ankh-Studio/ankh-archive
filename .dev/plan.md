
# Multi-URL Crawl Implementation Plan

## Updated Plan Based on Follow-up Answers

### Phase 1: Core Infrastructure (Priority: High)
#### 1.1 URL Input & Validation
- Add crawl modal component to popup/side panel
- Implement URL validation (max 100 URLs)
- Sequential processing with existing CrawlManager
- Template selector integration

#### 1.2 Progress Management
- Persistent progress tracking across sessions
- Basic success/failure counting
- Detailed error logging for failures
- Cancel operation capability

#### 1.3 Template Integration
- Remember last used crawl template
- Single template for all URLs in operation
- Reuse existing template dropdown logic

### Phase 2: UI/UX Implementation (Priority: High)
#### 2.1 Modal Interface
- Overlay modal for crawl input
- URL textarea (one per line, max 100)
- Template selector dropdown
- Progress indicator with status

#### 2.2 Button Placement
- Analyze existing UI patterns for optimal placement
- Add to both popup and side panel
- Follow established design patterns

#### 2.3 Context Menu Integration
- Add "Crawl Multiple URLs" to right-click menu
- Available on all pages
- Opens popup with crawl interface

### Phase 3: Enhanced Features (Priority: Medium)
#### 3.1 Results Management
- Results summary with success/failure counts
- Links to created notes
- Retry failed URLs option

#### 3.2 Settings Integration
- Crawl-specific settings in general settings
- Default template selection
- Progress persistence toggle

### Phase 4: Optimization (Priority: Low - Backlogged)
#### 4.1 Performance
- Concurrent processing optimization
- Smart clipboard URL detection
- Advanced progress UI with detailed status

#### 4.2 Advanced Features
- Crawl history tracking
- Export/import URL lists
- Template suggestions based on URL patterns

## Implementation Strategy

### Minimal Change Approach
1. **Reuse Existing Components**: Template dropdowns, vault selectors, progress indicators
2. **Modal Overlay**: Add crawl interface as modal rather than new pages
3. **Follow Patterns**: Use existing event listeners and state management
4. **CSS Integration**: Extend existing SCSS structure

### Browser Extension Considerations
- **Manifest Updates**: Add any required permissions
- **Background Script**: Extend for context menu handling
- **Content Scripts**: Minimal changes, reuse existing functionality
- **Storage**: Extend existing storage patterns for crawl state

## Technical Architecture

### New Components
- `CrawlModal` - Main crawl interface component
- `CrawlProgressManager` - Handle progress persistence
- `URLValidator` - Validate and clean URLs

### Modified Components
- `popup.ts` - Add crawl button and modal integration
- `background.ts` - Add context menu options
- `CrawlManager` - Minor enhancements for UI integration
- Settings - Add crawl-specific configuration

### Data Flow
1. User Input → URL Validation → Template Selection
2. CrawlManager.crawlUrls() → Progress Updates → Storage
3. Results → Summary Display → Note Links

## Risk Mitigation
- **Performance**: Sequential processing prevents overwhelming
- **Error Handling**: Detailed logging with retry capability
- **User Experience**: Cancel operation and progress persistence
- **Browser Compatibility**: Use existing polyfills and patterns
