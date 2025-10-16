import { XIcon } from '@shopify/polaris-icons';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'General',
    shortcuts: [
      { keys: ['Ctrl', 'S'], description: 'Save design' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Y'], description: 'Redo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo (alternative)' },
      { keys: ['Esc'], description: 'Deselect / Close modal' },
    ],
  },
  {
    category: 'Layers',
    shortcuts: [
      { keys: ['Delete'], description: 'Delete selected layer' },
      { keys: ['Backspace'], description: 'Delete selected layer (Mac)' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate selected layer' },
      { keys: ['Ctrl', ']'], description: 'Move layer up' },
      { keys: ['Ctrl', '['], description: 'Move layer down' },
      { keys: ['Ctrl', 'A'], description: 'Select all layers' },
    ],
  },
  {
    category: 'Canvas',
    shortcuts: [
      { keys: ['Ctrl', '+'], description: 'Zoom in' },
      { keys: ['Ctrl', '-'], description: 'Zoom out' },
      { keys: ['Ctrl', '0'], description: 'Reset zoom' },
      { keys: ['Space', 'Drag'], description: 'Pan canvas' },
      { keys: ['Ctrl', 'G'], description: 'Toggle grid' },
      { keys: ['Ctrl', 'R'], description: 'Toggle rulers' },
    ],
  },
  {
    category: 'Objects',
    shortcuts: [
      { keys: ['↑', '↓', '←', '→'], description: 'Move selected object (1px)' },
      { keys: ['Shift', '↑', '↓', '←', '→'], description: 'Move selected object (10px)' },
      { keys: ['Ctrl', 'L'], description: 'Lock/Unlock selected layer' },
      { keys: ['Ctrl', 'H'], description: 'Hide/Show selected layer' },
    ],
  },
  {
    category: 'Text',
    shortcuts: [
      { keys: ['Ctrl', 'B'], description: 'Toggle bold' },
      { keys: ['Ctrl', 'I'], description: 'Toggle italic' },
      { keys: ['Ctrl', 'U'], description: 'Toggle underline' },
      { keys: ['Double Click'], description: 'Edit text' },
    ],
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
          <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3a3a3a] rounded-lg transition text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Shortcuts Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SHORTCUTS.map((section) => (
              <div key={section.category}>
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-4">
                  {section.category}
                </h4>
                
                <div className="space-y-3">
                  {section.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{shortcut.description}</span>
                      
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-xs font-mono text-gray-200 min-w-[28px] text-center">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-500 text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#3a3a3a]">
          <p className="text-sm text-gray-400">
            Press <kbd className="px-2 py-1 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-xs font-mono">?</kbd> to toggle this help panel
          </p>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition text-white"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

