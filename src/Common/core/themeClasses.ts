export const theme = {
    page: 'bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white',
    heading: 'text-zinc-900 dark:text-white',
    subheading: 'text-zinc-600 dark:text-zinc-400',
    muted: 'text-zinc-500 dark:text-zinc-400',
    label: 'text-zinc-700 dark:text-zinc-300',
    hint: 'text-zinc-500',
  
    header:
      'sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95',
    logo: 'text-zinc-900 dark:text-white',
  
    navActive: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white',
    navInactive:
      'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white',
  
    card: 'rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900',
    cardShadow:
      'rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-300/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40',
  
    input:
      'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500',
    inputLg:
      'w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500',
    select:
      'mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white',
  
    chipInactive:
      'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white',
    chipActive: 'border-red-500 bg-red-600 text-white',
  
    btnSecondary:
      'rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-white',
    btnPrimary:
      'rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500',
  
    placeholderBox:
      'flex items-center justify-center rounded-lg bg-zinc-200 p-3 text-center text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    avatarPlaceholder:
      'flex items-center justify-center rounded-full bg-zinc-200 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  
    errorBox:
      'rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300',
    errorBoxLg:
      'rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-700 dark:text-red-300',
  
    boundary:
      'rounded-xl border border-zinc-200 bg-zinc-100 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900',
    boundaryText: 'text-sm font-medium text-zinc-600 dark:text-zinc-300',
  
    genreBadge:
      'rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300',
    recentChip:
      'rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 transition hover:border-red-500 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white',
  
    linkTitle:
      'text-zinc-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400',
  
    /* Hero/detail backdrops — always dark overlay for readability */
    heroOverlay:
      'absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20',
    heroOverlayBottom:
      'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent',
    heroFallback: 'absolute inset-0 bg-zinc-300 dark:bg-zinc-900',
  } as const
  
  export function navLinkClass({ isActive }: { isActive: boolean }) {
    return [
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? theme.navActive : theme.navInactive,
    ].join(' ')
  }
  
  export function chipClass(isActive: boolean) {
    return [
      'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
      isActive ? theme.chipActive : theme.chipInactive,
    ].join(' ')
  }