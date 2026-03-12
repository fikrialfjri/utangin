import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import type { IContactDetail } from '@/types/services';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import InputAvatar from '@/components/shared/input-avatar';

import useForm from '@/hooks/use-form';
import { usePageTitle } from '@/hooks/use-page-header';
import { useGet, usePost, usePut } from '@/hooks/use-services';

import { valid } from '@/utils/validators';

const FormContactPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: editContact } = useGet(
    `/contact/${id}`,
    {},
    {
      shouldFetch: isEdit,
      saveQuery: false,
    },
  ) as { data: IContactDetail | null };

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [existingAvatar, setExistingAvatar] = useState<string | null>(null);

  const { state, errors, handleFormChange, setFormState, resetForm, isValid } =
    useForm(
      { name: '' },
      {
        requiredFields: ['name'],
        validators: {
          name: [valid.max('Nama', 64)],
        },
      },
    );

  useEffect(() => {
    if (editContact) {
      setFormState({ name: editContact.name });
      if (editContact.avatar) {
        setExistingAvatar(editContact.avatar);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editContact]);

  const titleLabel = isEdit ? 'Edit Kontak' : 'Tambah Kontak';
  usePageTitle(titleLabel);

  const { handlePost, loadingPost } = usePost('/contact', {
    onSuccess: (res) => {
      navigate(`/contact/${res.data.id}`);
      resetForm();
    },
  });

  const { handlePut, loadingPut } = usePut(`/contact/${id}`, {
    onSuccess: () => {
      navigate(`/contact/${id}`);
      resetForm();
    },
  });

  const buildFormData = () => {
    const formData = new FormData();
    formData.append('name', state.name.trim());
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const formData = buildFormData();

    if (isEdit) {
      await handlePut(formData, `/contact/${id}`);
    } else {
      await handlePost(formData);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (!file) setExistingAvatar(null);
  };

  const loading = loadingPost || loadingPut;

  return (
    <form
      className="flex flex-col justify-between h-full pt-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-center">
          <InputAvatar
            name="avatar"
            value={avatarFile}
            previewUrl={existingAvatar}
            defaultName={state.name}
            onChange={handleAvatarChange}
          />
        </div>
        <Input
          id="name"
          name="name"
          type="text"
          label="Nama Kontak"
          placeholder="Masukkan nama kontak"
          value={state.name}
          onChange={handleFormChange}
          error={errors.name}
          maxLength={64}
          required
        />
      </div>
      <footer className="mt-5 flex flex-col gap-3 items-center">
        <Button
          type="submit"
          block
          disabled={!isValid || !state.name.trim()}
          loading={loading}
        >
          {isEdit ? 'Simpan Perubahan' : 'Simpan'}
        </Button>
      </footer>
    </form>
  );
};

export default FormContactPage;
