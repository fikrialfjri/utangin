import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface PageContextValue {
  title: string;
  setTitle: (title: string) => void;
  onHeaderAction: (() => void) | null;
  setOnHeaderAction: (cb: (() => void) | null) => void;
}

const PageContext = createContext<PageContextValue>({
  title: '',
  setTitle: () => {},
  onHeaderAction: null,
  setOnHeaderAction: () => {},
});

interface PageTitleProviderProps {
  children: ReactNode;
}

export const PageTitleProvider = ({ children }: PageTitleProviderProps) => {
  const [title, setTitle] = useState('');
  const [onHeaderAction, setOnHeaderAction] = useState<(() => void) | null>(
    null,
  );

  const stableSetTitle = useCallback((t: string) => setTitle(t), []);
  const stableSetOnHeaderAction = useCallback(
    (cb: (() => void) | null) => setOnHeaderAction(() => cb),
    [],
  );

  const value = useMemo(
    () => ({
      title,
      setTitle: stableSetTitle,
      onHeaderAction,
      setOnHeaderAction: stableSetOnHeaderAction,
    }),
    [title, onHeaderAction, stableSetTitle, stableSetOnHeaderAction],
  );

  return (
    <PageContext.Provider value={value}>{children}</PageContext.Provider>
  );
};

export const usePageTitle = (title: string) => {
  const { setTitle } = useContext(PageContext);

  useEffect(() => {
    setTitle(title);
    return () => setTitle('');
  }, [title, setTitle]);
};

export const usePageTitleValue = () => {
  const { title } = useContext(PageContext);
  return title;
};

export const usePageHeaderAction = (onAction: () => void) => {
  const { setOnHeaderAction } = useContext(PageContext);

  useEffect(() => {
    setOnHeaderAction(onAction);
    return () => setOnHeaderAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOnHeaderAction]);
};

export const usePageHeaderActionValue = () => {
  const { onHeaderAction } = useContext(PageContext);
  return onHeaderAction;
};
