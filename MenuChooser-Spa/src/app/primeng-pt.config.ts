export const PT = {

  // ─── DIALOG ────────────────────────────────────────────────
  dialog: {
    root: {
      class: [
        'bg-white',
        'rounded-[20px]',
        'shadow-[0_8px_32px_rgba(61,43,31,0.13)]',
        'border border-[#eddfc8]',
        'overflow-hidden',
        'w-full max-w-3xl',
      ],
    },
    header: {
      class: [
        'flex items-center justify-between',
        'px-8 py-5',
        'border-b border-[#eddfc8]',
        'bg-white',
      ],
    },
    title: {
      class: [
        'font-["Playfair_Display",Georgia,serif]',
        'text-xl text-[#2d1f14]',
        'font-semibold',
      ],
    },
    closeButton: {
      class: [
        'ml-auto',
        'flex items-center justify-center',
        'w-8 h-8 rounded-[6px]',
        'text-[#9c7c6e]',
        'bg-transparent border border-[#e0cfc4]',
        'cursor-pointer transition-all duration-150',
        'hover:bg-[#f7f0e3] hover:text-[#2d1f14]',
        'focus:outline-none focus:ring-2 focus:ring-[#8fad89]/30',
      ],
    },
    closeButtonIcon: {
      class: ['w-3.5 h-3.5'],
    },
    content: {
      class: [
        'px-8 py-6',
        'overflow-y-auto',
        'max-h-[75vh]',
        'bg-white',
      ],
    },
    footer: {
      class: [
        'flex items-center justify-end gap-3',
        'px-8 py-5',
        'border-t border-[#eddfc8]',
        'bg-[#fdfaf5]',
      ],
    },
    mask: {
      class: [
        'fixed inset-0 z-50',
        'bg-[#3d2b1f]/40',
        'backdrop-blur-[2px]',
        'flex items-center justify-center',
        'p-6',
      ],
    },
    transition: {
      enterFromClass: 'opacity-0 scale-95',
      enterActiveClass: 'transition-all duration-200 ease-out',
      leaveActiveClass: 'transition-all duration-150 ease-in',
      leaveToClass: 'opacity-0 scale-95',
    },
  },

  // ─── POPOVER ─────────────────────────────────────────────
  popover: {
    root: {
      class: [
        'bg-white',
        'rounded-[12px]',
        'shadow-[0_4px_16px_rgba(61,43,31,0.10)]',
        'border border-[#eddfc8]',
        'overflow-hidden',
        'w-[320px]',
      ],
    },
    content: {
      class: [
        'p-0',
      ],
    },
    transition: {
      enterFromClass: 'opacity-0 translate-y-1',
      enterActiveClass: 'transition-all duration-150 ease-out',
      leaveActiveClass: 'transition-all duration-100 ease-in',
      leaveToClass: 'opacity-0 translate-y-1',
    },
  },

} as const;
