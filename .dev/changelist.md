
# Multi-URL Crawl Feature - File Changes

## New Files Required

### Core Components
- `src/components/crawl-modal.ts` - Main crawl interface modal
- `src/utils/url-validator.ts` - URL validation and cleaning utilities
- `src/managers/crawl-ui-manager.ts` - Crawl UI state management

### Styling
- `src/styles/crawl.scss` - Crawl-specific styles
- Add crawl styles to main style imports

## Files to Modify

### UI Integration
1. **`src/core/popup.ts`**
   - Add crawl button event listener
   - Initialize crawl modal
   - Handle modal state management

2. **`src/popup.html`**
   - Add crawl button in appropriate location
   - Add modal HTML structure
   - Include crawl-related elements

3. **`src/side-panel.html`**
   - Add crawl button for side panel access
   - Include modal structure
   - Maintain consistent UI

### Context Menu
4. **`src/background.ts`**
   - Add "Crawl Multiple URLs" context menu item
   - Handle context menu click events
   - Open popup with crawl interface

### Enhanced CrawlManager
5. **`src/managers/crawl-manager.ts`**
   - Add progress persistence
   - Enhance error logging
   - Add cancel operation support
   - Integrate with UI state management

### Settings & Storage
6. **`src/utils/storage-utils.ts`**
   - Add crawl-specific settings
   - Last used template persistence
   - Progress state storage

7. **`src/settings.html`** (Minor changes)
   - Remove/modify existing crawl UI elements
   - Integrate with new crawl system
   - Add crawl preferences section

### Styling Updates
8. **`src/styles/modals.scss`**
   - Extend modal styles for crawl modal
   - Progress indicator styles
   - URL input styling

9. **`src/styles/popup.scss`**
   - Crawl button placement styles
   - Mobile responsiveness
   - Integration with existing layout

### Internationalization
10. **`src/_locales/en/messages.json`** (and other locales)
    - Add missing crawl-related strings
    - Update existing crawl messages
    - Ensure consistency across languages

## File Change Priorities

### Phase 1 (High Priority)
- `src/components/crawl-modal.ts` - Core modal component
- `src/utils/url-validator.ts` - URL validation
- `src/core/popup.ts` - Button and modal integration
- `src/popup.html` - UI structure
- `src/styles/crawl.scss` - Basic styling

### Phase 2 (Medium Priority)
- `src/background.ts` - Context menu
- `src/managers/crawl-manager.ts` - Enhanced functionality
- `src/utils/storage-utils.ts` - Settings persistence
- `src/side-panel.html` - Side panel integration

### Phase 3 (Low Priority)
- `src/settings.html` - Settings cleanup
- Localization files - String updates
- Advanced styling - Polish and refinement

## Existing Code Reuse

### Components to Leverage
- Template dropdown from `src/managers/template-ui.ts`
- Progress indicators from existing patterns
- Modal overlay system from settings
- Storage patterns from `src/utils/storage-utils.ts`

### Functions to Reuse
- `createObsidianNote()` from `src/utils/obsidian-note-creator.ts`
- `extractPageContent()` from `src/utils/content-extractor.ts`
- `getMessage()` from `src/utils/i18n.ts`
- Existing validation patterns from template system

## Change Impact Assessment

### Low Risk Changes
- New file creation (no existing functionality affected)
- CSS additions (extend existing styles)
- Localization updates (additive changes)

### Medium Risk Changes
- Background script modifications (existing context menu)
- CrawlManager enhancements (extend existing API)
- Storage system updates (add new properties)

### High Risk Changes
- Settings HTML modifications (existing UI)
- Popup HTML structure changes (space constraints)

## Testing Considerations

### Browser Compatibility
- Chrome: Side panel integration
- Firefox: Background script differences
- Safari: Service worker considerations

### UI/UX Testing
- Modal responsiveness across screen sizes
- Button placement accessibility
- Context menu functionality
- Progress indicator accuracy

### Functional Testing
- URL validation edge cases
- Progress persistence across browser restarts
- Error handling and retry functionality
- Template selection and application
