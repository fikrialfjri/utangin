import { Slide, ToastContainer } from 'react-toastify';

import MainRouter from '@/router';

const App = () => {
  return (
    <>
      <MainRouter />
      <ToastContainer position="top-center" transition={Slide} limit={3} />
    </>
  );
};

export default App;
