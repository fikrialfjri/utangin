import Button from '@/components/shared/button';
import Input from '@/components/shared/input';

import useForm from '@/hooks/use-form';
import { usePost } from '@/hooks/use-services';

import { setToken } from '@/utils/storages';

const LoginPage = () => {
  const { state, handleFormChange, resetForm } = useForm({
    email: '',
    password: '',
  });
  const { handlePost } = usePost('/auth/login', {
    onSuccess: (res) => {
      const token = res.access_token;

      if (token) {
        setToken(token);
        globalThis.location.replace('/');
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={async (e) => {
        e.preventDefault();

        await handlePost(state);
        resetForm();
      }}
    >
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Masukkan email disini"
        onChange={handleFormChange}
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Masukkan password disini"
        onChange={handleFormChange}
      />
      <footer className="mt-5 flex flex-col items-center">
        <Button type="submit" block>
          Masuk
        </Button>
      </footer>
    </form>
  );
};

export default LoginPage;
