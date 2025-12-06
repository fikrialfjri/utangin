import { useNavigate } from 'react-router';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';

import useForm from '@/hooks/use-form';
import { usePost } from '@/hooks/use-services';

import { setToken } from '@/utils/storages';

const LoginPage = () => {
  const navigate = useNavigate();

  const { state, errors, handleFormChange, resetForm, isValid } = useForm({
    email: '',
    password: '',
  });
  const { handlePost, loadingPost } = usePost('/auth/login', {
    onSuccess: (res) => {
      const token = res.access_token;

      if (token) {
        setToken(token);
        globalThis.location.replace('/');
        resetForm();
      }
    },
  });

  return (
    <>
      <form
        className="flex flex-col gap-5"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!isValid) return;

          await handlePost(state);
        }}
      >
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Masukkan email disini"
          value={state.email}
          onChange={handleFormChange}
          error={errors.email}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Masukkan password disini"
          value={state.password}
          onChange={handleFormChange}
          error={errors.password}
          required
        />
        <footer className="mt-5 flex flex-col gap-3 items-center">
          <Button type="submit" block disabled={!isValid} loading={loadingPost}>
            Masuk
          </Button>
        </footer>
      </form>

      <div className="absolute bottom-0 w-full flex justify-center gap-1">
        <span className="typo-body-lg font-normal!">Belum memiliki akun?</span>
        <Button variant="link" onClick={() => navigate('/auth/register')}>
          Buat akun disini
        </Button>
      </div>
    </>
  );
};

export default LoginPage;
