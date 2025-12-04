/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';

import useForm from '@/hooks/use-form';
import { usePost } from '@/hooks/use-services';

import { PASSWORD_RULES } from '@/libs/constants';

import { isAllPasswordRulesFulfilled, joinClassnames } from '@/utils/commons';
import { setToken } from '@/utils/storages';
import { valid } from '@/utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { state, errors, handleFormChange, resetForm, isValid } = useForm(
    {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    {
      requiredFields: [
        'username',
        'first_name',
        'email',
        'password',
        'confirm_password',
      ],
      validators: {
        username: [valid.max('Username', 100)],
        first_name: [valid.max('Nama depan', 100)],
        email: [valid.max('Email', 100)],
        password: [valid.min('Password', 8), valid.max('Password', 100)],
        confirm_password: [
          (value, values) => {
            if (value !== values?.password) {
              return 'Konfirmasi password tidak sama';
            }
            return null;
          },
        ],
      },
    },
  );
  const { handlePost } = usePost('/auth/register', {
    onSuccess: (res) => {
      const token = res.access_token;

      if (token) {
        setToken(token);
        globalThis.location.replace('/');
        resetForm();
      }
    },
  });

  const allPasswordRulesOk = isAllPasswordRulesFulfilled(state.password);

  return (
    <>
      <form
        className="flex flex-col gap-5"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!isValid) return;

          const newState: Record<string, any> = { ...state };

          newState['full_name'] =
            `${newState['first_name']} ${newState['last_name']}`.trim();

          delete newState['first_name'];
          delete newState['last_name'];

          await handlePost(newState);
        }}
      >
        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="Masukkan username disini"
          value={state.username}
          onChange={handleFormChange}
          error={errors.username}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="first_name"
            name="first_name"
            type="text"
            label="Nama Depan"
            placeholder="Nama depan"
            value={state.first_name}
            onChange={handleFormChange}
            error={errors.first_name}
            required
          />
          <Input
            id="last_name"
            name="last_name"
            type="text"
            label="Nama Belakang (Opsional)"
            placeholder="Nama belakang"
            value={state.last_name}
            onChange={handleFormChange}
            error={errors.last_name}
          />
        </div>
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
        <div className="flex flex-col gap-3">
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
          {!allPasswordRulesOk && (
            <ul className="space-y-1 ml-2">
              {PASSWORD_RULES.map(({ regex, label }, idx) => {
                const isFulfilled = regex.test(state.password);

                return (
                  !isFulfilled && (
                    <li
                      key={idx}
                      className={joinClassnames([
                        'flex items-center gap-2 typo-body-md text-neutral-4 overflow-hidden',
                      ])}
                    >
                      {label}
                    </li>
                  )
                );
              })}
            </ul>
          )}
        </div>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          label="Konfirmasi Password"
          placeholder="Masukkan konfirmasi password disini"
          value={state.confirm_password}
          onChange={handleFormChange}
          error={errors.confirm_password}
          required
        />
        <footer className="mt-5 flex flex-col items-center">
          <Button type="submit" block disabled={!isValid}>
            Buat Akun
          </Button>
        </footer>
      </form>

      <div className="absolute bottom-0 w-full flex justify-center gap-1">
        <span className="typo-body-lg font-normal!">Sudah memiliki akun?</span>
        <Button variant="link" onClick={() => navigate('/auth/login')}>
          Login disini
        </Button>
      </div>
    </>
  );
};

export default RegisterPage;
