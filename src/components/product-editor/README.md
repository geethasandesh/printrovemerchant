# Product Editor Components

This folder contains all the modal and utility components for the Product Design Editor.

## Components

### ImageEditorModal.tsx
Advanced image editing modal with:
- 8 filter controls (brightness, contrast, saturation, blur, hue, grayscale, sepia, invert)
- Crop functionality
- Real-time preview
- Reset options

**Usage:**
```tsx
<ImageEditorModal
  isOpen={showImageEditor}
  imageSrc={imageUrl}
  onClose={() => setShowImageEditor(false)}
  onSave={(editedImage, filters) => {
    // Handle edited image
  }}
/>
```

### TextEditorModal.tsx
Comprehensive text editor with:
- 18+ font families
- Font size, weight, style
- Color picker
- Text alignment
- Text transforms
- Letter spacing, line height
- Live preview

**Usage:**
```tsx
<TextEditorModal
  isOpen={showTextEditor}
  initialText="Hello World"
  initialFontSize={24}
  initialFontFamily="Arial"
  initialColor="#000000"
  initialFontWeight="normal"
  initialTextAlign="left"
  onClose={() => setShowTextEditor(false)}
  onSave={(textData) => {
    // Handle text data
  }}
/>
```

### TemplateLibraryModal.tsx
Template browser with:
- Category filtering
- Search functionality
- Template grid view
- Hover previews

**Usage:**
```tsx
<TemplateLibraryModal
  isOpen={showTemplates}
  onClose={() => setShowTemplates(false)}
  onSelectTemplate={(template) => {
    // Handle template selection
  }}
/>
```

### KeyboardShortcutsModal.tsx
Help modal showing all keyboard shortcuts organized by category.

**Usage:**
```tsx
<KeyboardShortcutsModal
  isOpen={showShortcuts}
  onClose={() => setShowShortcuts(false)}
/>
```

### ExportModal.tsx
Export design with options for:
- Format (PNG, JPG, SVG, PDF)
- Quality (for JPG)
- Resolution (1x-4x)
- File size estimation

**Usage:**
```tsx
<ExportModal
  isOpen={showExport}
  onClose={() => setShowExport(false)}
  onExport={(format, quality, scale) => {
    // Handle export
  }}
/>
```

### DragDropUpload.tsx
File upload component with:
- Drag and drop support
- Click to browse
- File validation
- Error messages

**Usage:**
```tsx
<DragDropUpload
  onFileSelect={(file) => {
    // Handle file upload
  }}
  accept="image/*"
  maxSizeMB={10}
/>
```

## Adding New Components

To add a new modal or component:

1. Create file in this folder
2. Export component with proper TypeScript types
3. Import in parent component (`ProductDesignEditor.tsx`)
4. Add state for open/close
5. Add trigger button/action
6. Document usage here

## Styling

All components use:
- Dark theme colors (#1e1e1e, #2a2a2a, #3a3a3a)
- Blue accent (#3b82f6)
- Consistent spacing and borders
- Tailwind CSS classes

## Testing

Test checklist for each modal:
- [ ] Opens/closes properly
- [ ] All controls work
- [ ] Real-time preview updates
- [ ] Save/apply functionality works
- [ ] Cancel/close discards changes
- [ ] Keyboard shortcuts work (Esc to close)
- [ ] Mobile responsive
- [ ] No console errors

