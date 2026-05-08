import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Page = 'home' | 'product' | 'cart' | 'checkout' | 'order-confirmation'| 'contact'| 'artisanat'| 'order-success'| 'admin' | 'admin-login';

interface PageContextType {
  page: Page;
  navigate: (page: Page) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const navigate = useCallback((newPage: Page) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <PageContext.Provider value={{ page, navigate, selectedProductId, setSelectedProductId }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
}
