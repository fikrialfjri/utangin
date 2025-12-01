import Button from '@/components/shared/button';
import Input from '@/components/shared/input';

import useForm from '@/hooks/use-form';
import { usePost } from '@/hooks/use-services';

import { setToken } from '@/utils/storages';
import { valid } from '@/utils/validators';

const LoginPage = () => {
  const { state, errors, handleFormChange, resetForm, isValid } = useForm(
    {
      email: '',
      password: '',
    },
    {
      validators: {
        email: [valid.required('Email wajib diisi')],
        password: [valid.required('Password wajib diisi')],
      },
    },
  );
  const { handlePost } = usePost('/auth/login', {
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
      />
      <footer className="mt-5 flex flex-col items-center">
        <Button type="submit" block disabled={!isValid}>
          Masuk
        </Button>
      </footer>
    </form>
  );
};

export default LoginPage;
