import re

files_to_update = [
    'resources/js/Pages/Vocabs/Index.tsx',
    'resources/js/Pages/Practice/Index.tsx',
    'resources/js/Components/VocabCard.tsx',
    'resources/js/Components/VocabFormModal.tsx',
    'resources/js/Components/PinyinGuideModal.tsx',
    'resources/js/Components/DeleteConfirmModal.tsx',
    'resources/js/Components/GuestAuthPromptModal.tsx',
    'resources/js/Components/DrawingCanvas.tsx',
    'resources/js/Components/Pagination.tsx'
]

# Mapping strictly from current hardcoded dark mode to light mode + dark mode
# Note: Order matters! Replace longer strings first.
replacements = {
    'bg-[#090d16]/95': 'bg-white/95 dark:bg-[#090d16]/95',
    'bg-[#090d16]': 'bg-slate-50 dark:bg-[#090d16]',
    
    'bg-slate-900/95': 'bg-white/95 dark:bg-slate-900/95',
    'bg-slate-900/90': 'bg-white/90 dark:bg-slate-900/90',
    'bg-slate-900/60': 'bg-white/60 dark:bg-slate-900/60',
    'bg-slate-900/50': 'bg-white/50 dark:bg-slate-900/50',
    'bg-slate-900': 'bg-white dark:bg-slate-900',
    
    'bg-slate-950/80': 'bg-slate-100/80 dark:bg-slate-950/80',
    'bg-slate-950/50': 'bg-slate-100/50 dark:bg-slate-950/50',
    'bg-slate-950': 'bg-slate-100 dark:bg-slate-950',
    
    'bg-slate-800/70': 'bg-slate-100/70 dark:bg-slate-800/70',
    'bg-slate-800/50': 'bg-slate-100/50 dark:bg-slate-800/50',
    'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
    
    'text-slate-100': 'text-slate-900 dark:text-slate-100',
    'text-slate-200': 'text-slate-800 dark:text-slate-200',
    'text-slate-300': 'text-slate-700 dark:text-slate-300',
    'text-slate-400': 'text-slate-500 dark:text-slate-400',
    'text-slate-500': 'text-slate-400 dark:text-slate-500',
    
    'border-slate-800/80': 'border-slate-200/80 dark:border-slate-800/80',
    'border-slate-800/60': 'border-slate-200/60 dark:border-slate-800/60',
    'border-slate-800': 'border-slate-200 dark:border-slate-800',
    
    'border-slate-700/80': 'border-slate-300/80 dark:border-slate-700/80',
    'border-slate-700/60': 'border-slate-300/60 dark:border-slate-700/60',
    'border-slate-700': 'border-slate-300 dark:border-slate-700',
    
    'hover:bg-slate-700': 'hover:bg-slate-200 dark:hover:bg-slate-700',
    'hover:bg-slate-800': 'hover:bg-slate-100 dark:hover:bg-slate-800',
}

import os

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple replace by searching for word boundaries
    for old, new in replacements.items():
        # Prevent double replacing if already has dark:
        # e.g., if we already have dark:bg-slate-900, we don't want to replace bg-slate-900 again
        # We do this by regex: \b(old)\b but ignoring if preceded by 'dark:' or 'light:'
        # Actually since we haven't run it yet, we can just do a straightforward regex
        escaped_old = re.escape(old)
        pattern = r'(?<!dark:)' + escaped_old + r'(?!\S)'
        content = re.sub(pattern, new, content)
        
    # Manual fixes for text-white where it shouldn't be dark
    content = content.replace('text-slate-900 dark:text-white', 'text-white') # Revert text-white replacement in icons/buttons usually
    
    # But wait, text-white was not in the dict! I didn't add it.
    
    with open(filepath, 'w') as f:
        f.write(content)
        
print("Replacement complete.")
