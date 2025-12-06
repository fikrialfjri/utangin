import { Slide, ToastContainer } from 'react-toastify';

import MainRouter from '@/router';

import { useDesktopScreen } from './hooks/use-desktop-screen';

const App = () => {
  const isDesktop = useDesktopScreen();

  return (
    <>
      <MainRouter />
      <ToastContainer
        position={isDesktop ? 'bottom-right' : 'top-center'}
        transition={Slide}
        limit={3}
      />
    </>
  );
};

export default App;
