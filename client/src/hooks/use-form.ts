/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent } from 'react';

import { hasTruthyValue, isAllFilled } from '@/utils/commons';
import { runFieldValidators, type FieldValidators } from '@/utils/validators';

const useForm = <T extends Record<string, any>>(
  initialState: T,
  options?: {
    validators?: FieldValidators<T>;
    requiredFields?: (keyof T)[];
  },
) => {
  const [state, setState] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const key = name as keyof T;
    const newValues = { ...state, [key]: value };

    setState(newValues);

    const message = runFieldValidators(
      key,
      value,
      newValues,
      options?.validators,
    );
    setErrors((prev) => ({
      ...prev,
      [key]: message || undefined,
    }));
  };

  const resetForm = () => {
    setState(initialState);
    setErrors({});
  };

  const isAllRequiredFilled = (state: T, requiredFields?: (keyof T)[]) => {
    if (!requiredFields || requiredFields.length === 0)
      return isAllFilled(state);

    const newState = Object.fromEntries(
      requiredFields.map((field) => [field, state[field]]),
    ) as Partial<T>;

    return isAllFilled(newState as Record<string, any>);
  };

  const isValid =
    isAllRequiredFilled(state, options?.requiredFields) &&
    !hasTruthyValue(errors as any);

  return {
    state,
    errors,
    handleFormChange,
    resetForm,
    isValid,
  };
};

export default useForm;
