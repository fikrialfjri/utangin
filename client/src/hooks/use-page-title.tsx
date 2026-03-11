import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

interface PageTitleContextValue {
  title: string;
  setTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextValue>({
  title: '',
  setTitle: () => {},
});

interface PageTitleProviderProps {
  children: ReactNode;
}

export const PageTitleProvider = ({ children }: PageTitleProviderProps) => {
  const [title, setTitle] = useState('');

  const value = useMemo(() => ({ title, setTitle }), [title]);

  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = (title: string) => {
  const context = useContext(PageTitleContext);

  if (context.title !== title) {
    context.setTitle(title);
  }
};

export const usePageTitleValue = () => {
  const { title } = useContext(PageTitleContext);
  return title;
};
