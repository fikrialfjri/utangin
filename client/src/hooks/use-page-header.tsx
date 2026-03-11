import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface PageContextValue {
  title: string;
  setTitle: (title: string) => void;
  headerAction: ReactNode;
  setHeaderAction: (action: ReactNode) => void;
}

const PageContext = createContext<PageContextValue>({
  title: '',
  setTitle: () => {},
  headerAction: null,
  setHeaderAction: () => {},
});

interface PageTitleProviderProps {
  children: ReactNode;
}

export const PageTitleProvider = ({ children }: PageTitleProviderProps) => {
  const [title, setTitle] = useState('');
  const [headerAction, setHeaderAction] = useState<ReactNode>(null);

  const stableSetTitle = useCallback((t: string) => setTitle(t), []);
  const stableSetHeaderAction = useCallback(
    (a: ReactNode) => setHeaderAction(a),
    [],
  );

  const value = useMemo(
    () => ({
      title,
      setTitle: stableSetTitle,
      headerAction,
      setHeaderAction: stableSetHeaderAction,
    }),
    [title, headerAction, stableSetTitle, stableSetHeaderAction],
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

export const usePageHeaderAction = (action: ReactNode) => {
  const { setHeaderAction } = useContext(PageContext);
  const actionRef = useRef(action);
  actionRef.current = action;

  useEffect(() => {
    setHeaderAction(actionRef.current);
    return () => setHeaderAction(null);
  }, [setHeaderAction]);
};

export const usePageHeaderActionValue = () => {
  const { headerAction } = useContext(PageContext);
  return headerAction;
};

