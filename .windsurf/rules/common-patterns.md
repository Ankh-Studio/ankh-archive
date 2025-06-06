---
trigger: always_on
---

## Common Patterns to Follow

### Template System
```typescript
// Follow this pattern for template-related code
interface Template {
    id: string;
    name: string;
    behavior: 'new' | 'append-daily' | 'prepend-daily' | 'overwrite';
    // ... other properties
}

// Use the template compiler for variable processing
import { compileTemplate } from '../utils/template-compiler';
```

### Storage Operations
```typescript
// Follow this pattern for storage operations
import { generalSettings, setGeneralSetting } from '../utils/storage-utils';

// Read settings
const currentVault = generalSettings.vault;

// Update settings
await setGeneralSetting('vault', newVaultName);
```

### Error Handling
```typescript
// Follow this pattern for error handling
try {
    const result = await operation();
    return result;
} catch (error) {
    console.error('Operation failed:', {
        operation: 'operationName',
        error: error.message,
        context: { /* relevant context */ }
    });
    throw new Error(`Operation failed: ${error.message}`);
}
```

### Modal Creation
```typescript
// Follow this pattern for modal creation
import { createModal, closeModal } from '../utils/modal-utils';

const modal = createModal({
    title: 'Modal Title',
    content: 'Modal content',
    onClose: () => {
        // Cleanup logic
    }
});
```