import { useState } from 'react';

import instance from '@/utils/axios-instance';
import { setToken } from '@/utils/storages';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('fikriii@gmail.com');
  const [password, setPassword] = useState<string>('Fikriii!123');

  const handleSubmit = async () => {
    try {
      const res = await instance.post('/auth/login', { email, password });

      const token = res.data?.access_token;

      if (token) {
        setToken(token);
        globalThis.location.replace('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="email"
        placeholder="Email"
        className="border border-neutral-4 rounded-lg p-2"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-neutral-4 rounded-lg p-2"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button
        type="submit"
        className="bg-primary text-white w-full p-2 rounded-lg cursor-pointer"
      >
        Masuk
      </button>
    </form>
  );
};

export default LoginPage;
