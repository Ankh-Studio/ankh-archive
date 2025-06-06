
# Coding Conventions and Patterns

## TypeScript Conventions

### File Organization
- **Naming**: kebab-case for files (`template-manager.ts`)
- **Extensions**: `.ts` for TypeScript, `.scss` for styles
- **Imports**: Relative paths for local files, absolute for utilities
- **Exports**: Named exports preferred over default exports

### Type Definitions
- **Location**: Centralized in `src/types/types.ts`
- **Interfaces**: PascalCase naming (`Template`, `Property`)
- **Enums**: PascalCase with descriptive names
- **Generics**: Single letter with descriptive constraints

```typescript
// Good
interface Template {
    id: string;
    name: string;
    behavior: 'new' | 'append-daily' | 'prepend-daily' | 'overwrite';
}

// Type guards
function isTemplate(obj: any): obj is Template {
    return obj && typeof obj.id === 'string';
}
```

### Function Patterns
- **Async/Await**: Preferred over Promise chains
- **Error Handling**: Try-catch blocks with meaningful errors
- **Parameters**: Object destructuring for multiple parameters
- **Return Types**: Explicit return types for public functions

```typescript
// Good pattern
export async function saveTemplate(
    template: Template,
    options: { validate?: boolean } = {}
): Promise<void> {
    try {
        if (options.validate) {
            validateTemplate(template);
        }
        await storage.set(`template-${template.id}`, template);
    } catch (error) {
        console.error('Failed to save template:', error);
        throw new Error(`Template save failed: ${error.message}`);
    }
}
```

## Browser Extension Patterns

### Storage Management
- **Settings**: Use `generalSettings` object pattern
- **Templates**: Prefixed keys (`template-${id}`)
- **Persistence**: Auto-save with debouncing
- **Migration**: Version-based upgrade system

```typescript
// Storage pattern
const generalSettings = {
    vault: '',
    legacyMode: false,
    silentOpen: true,
    // ... other settings
};

await storage.set('general-settings', generalSettings);
```

### Message Passing
- **Background Communication**: Structured message objects
- **Content Script**: Event-based communication
- **Error Propagation**: Consistent error format

```typescript
// Message pattern
interface ExtensionMessage {
    type: 'EXTRACT_CONTENT' | 'SAVE_TEMPLATE' | 'UPDATE_SETTINGS';
    payload: any;
    requestId?: string;
}
```

### UI Component Patterns
- **Event Delegation**: Attach listeners to containers
- **State Management**: Local state in component classes
- **Modal System**: Consistent overlay and backdrop handling
- **Form Validation**: HTML5 validation with custom messages

## SCSS/CSS Conventions

### File Structure
- **Variables**: Centralized in `_variables.scss`
- **Components**: One file per major component
- **Mixins**: Reusable style patterns
- **Browser Support**: Modern CSS with fallbacks

### Naming Convention
- **BEM Methodology**: Block-Element-Modifier pattern
- **CSS Variables**: `--prefix-property-name` format
- **Classes**: Semantic, not presentational names

```scss
// BEM pattern
.template-selector {
    &__dropdown {
        // Element styles
    }
    
    &--expanded {
        // Modifier styles
    }
}

// CSS variables
:root {
    --color-primary: #7c3aed;
    --color-background: #ffffff;
    --border-radius: 6px;
}
```

## Error Handling Patterns

### Consistent Error Management
- **Console Logging**: Detailed error context
- **User Feedback**: Non-technical error messages
- **Recovery**: Graceful degradation where possible
- **Reporting**: Structured error information

```typescript
// Error handling pattern
try {
    const result = await riskyOperation();
    return result;
} catch (error) {
    console.error('Operation failed:', {
        operation: 'riskyOperation',
        error: error.message,
        context: { /* relevant context */ }
    });
    
    // User-friendly message
    showNotification('Operation failed. Please try again.');
    
    // Re-throw with context
    throw new Error(`Risk operation failed: ${error.message}`);
}
```

## Internationalization Patterns

### Message Keys
- **Naming**: Descriptive, hierarchical keys
- **Placeholders**: Numbered parameters
- **HTML**: Separate start/end tags for formatting

```json
{
    "templateSaveSuccess": {
        "message": "Template '$1' saved successfully"
    },
    "exportPropertiesDescription": {
        "message": "Save properties to $strong_start$types.json$strong_end$ file",
        "placeholders": {
            "strong_start": { "content": "<strong>" },
            "strong_end": { "content": "</strong>" }
        }
    }
}
```

### Usage Pattern
```typescript
import { getMessage } from '../utils/i18n';

const message = getMessage('templateSaveSuccess', templateName);
```

## Performance Considerations

### Memory Management
- **Event Listeners**: Always remove on cleanup
- **Object References**: Avoid circular references
- **Storage**: Compress large data structures
- **DOM**: Minimize direct DOM manipulation

### Async Operations
- **Throttling**: Rate-limit frequent operations
- **Debouncing**: Delay expensive operations
- **Cancellation**: Support operation cancellation
- **Progress**: Provide feedback for long operations

```typescript
// Debounced auto-save pattern
const debouncedSave = debounce(async (data: any) => {
    await saveToStorage(data);
}, 500);
```

## Testing Patterns

### Manual Testing
- **Cross-browser**: Test on Chrome, Firefox, Safari
- **Mobile**: iOS Safari testing
- **Edge Cases**: Empty states, large data sets
- **Error Scenarios**: Network failures, permission denied

### Debugging
- **Console Groups**: Organized logging
- **Error Context**: Include relevant state information
- **Performance**: Monitor memory usage and timing
- **User Actions**: Log significant user interactions
