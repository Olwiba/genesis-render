import { createContext, useContext, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';

// ---------------------------------------------------------------------------
// NavigateContext
// Threads TanStack Router's navigate function down the renderer tree without
// prop drilling. GenesisPage wraps with NavigateProvider; BlockRenderer reads
// from useRendererNavigate.
// ---------------------------------------------------------------------------

type NavigateFn = ReturnType<typeof useNavigate>;

const NavigateContext = createContext<NavigateFn | null>(null);

export function NavigateProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <NavigateContext.Provider value={navigate}>
      {children}
    </NavigateContext.Provider>
  );
}

export function useRendererNavigate(): NavigateFn | null {
  return useContext(NavigateContext);
}
