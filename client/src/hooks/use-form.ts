/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent } from 'react';

const useForm = (initialState: any) => {
  const [state, setState] = useState<any>(initialState);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    setState((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    state,
    handleFormChange,
    resetForm: () => setState(initialState),
    setForm: setState,
  };
};

export default useForm;
