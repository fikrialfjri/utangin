import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import type { TransactionType } from '@/types/commons';
import type { ITransactionDetail } from '@/types/services';
import dayjs from 'dayjs';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import InputCurrency from '@/components/shared/input-currency';
import RadioGroup from '@/components/shared/radio-group';
import Select from '@/components/shared/select';

import useForm from '@/hooks/use-form';
import { usePageTitle } from '@/hooks/use-page-header';
import { useGet, usePost, usePut } from '@/hooks/use-services';

import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '@/libs/constants';

import { generateOptions, removeEmptyFields } from '@/utils/commons';
import { valid } from '@/utils/validators';

const typeOptions = [
  {
    id: 'hutang',
    value: 'DEBT',
    label: 'Hutang',
    selected_label: 'Saya Berhutang',
  },
  {
    id: 'piutang',
    value: 'RECEIVABLE',
    label: 'Piutang',
    selected_label: 'Mereka Berhutang',
  },
];

const FormTransactionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const transaction_type = searchParams.get(
    'transaction_type',
  ) as TransactionType;
  const isEdit = !!id;

  const { data: editTransaction } = useGet(
    `/transaction/${id}`,
    {},
    { shouldFetch: isEdit, saveQuery: false },
  ) as { data: ITransactionDetail | null };

  const {
    state,
    errors,
    handleFormChange,
    setFieldValue,
    setFormState,
    resetForm,
    isValid,
  } = useForm(
    {
      contact_id: null as number | null,
      type: transaction_type || TRANSACTION_TYPES.DEBT,
      status: TRANSACTION_STATUS.ACTIVE,
      amount: 0,
      date: '',
      note: '',
      due_date: '',
    },
    {
      requiredFields: ['contact_id', 'type', 'amount', 'date', 'status'],
      validators: {
        note: [valid.max('Catatan', 64)],
      },
    },
  );

  useEffect(() => {
    if (editTransaction) {
      setFormState({
        contact_id: editTransaction.contact?.id,
        type: editTransaction.type,
        status: editTransaction.status as typeof TRANSACTION_STATUS.ACTIVE,
        amount: editTransaction.amount,
        date: dayjs(editTransaction.date).format('YYYY-MM-DD'),
        note: editTransaction.note ?? '',
        due_date: editTransaction.due_date
          ? dayjs(editTransaction.due_date).format('YYYY-MM-DD')
          : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTransaction]);

  const titleLabel = isEdit
    ? state.type === TRANSACTION_TYPES.DEBT
      ? 'Edit Hutang'
      : 'Edit Piutang'
    : state.type === TRANSACTION_TYPES.DEBT
      ? 'Tambah Hutang'
      : 'Tambah Piutang';
  usePageTitle(titleLabel);

  const { data: contactData, refetch: refetchContact } = useGet('/contact');
  const { handlePost: handlePostContact } = usePost('/contact', {
    onSuccess: (res) => {
      setFieldValue('contact_id', res.data.id);
      refetchContact();
    },
  });
  const { handlePost, loadingPost } = usePost('/transaction', {
    onSuccess: () => {
      navigate('/');
      resetForm();
    },
  });
  const { handlePut, loadingPut } = usePut(`/transaction/${id}`, {
    onSuccess: () => {
      navigate(`/transaction/${id}`);
      resetForm();
    },
  });

  const labelPlaceholderData = {
    DEBT: {
      contact: 'Orang atau pihak pemberi pinjam',
      date: 'Tanggal pinjam',
    },
    RECEIVABLE: {
      contact: 'Orang atau pihak peminjam',
      date: 'Tanggal dipinjam',
    },
  };

  const handleCreateContact = (v: string) => {
    handlePostContact({ name: v });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    const payload = removeEmptyFields({
      ...state,
      amount: Number(state.amount),
    });

    if (isEdit) {
      await handlePut(payload, `/transaction/${id}`);
    } else {
      await handlePost(payload);
    }
  };

  const loading = loadingPost || loadingPut;

  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        <RadioGroup
          name="type"
          options={typeOptions}
          value={state.type}
          onChange={handleFormChange}
          block
        />
        <Select
          name="contact_id"
          options={generateOptions(contactData)}
          value={state.contact_id}
          onChange={handleFormChange}
          label="Kontak"
          placeholder={labelPlaceholderData[state.type].contact}
          block
          onCreate={handleCreateContact}
          required
        />
        <InputCurrency
          id="jumlah"
          name="amount"
          label="Jumlah"
          value={state.amount}
          onChange={handleFormChange}
          required
        />
        <Input
          id="date"
          name="date"
          type="date"
          label={labelPlaceholderData[state.type].date}
          placeholder="Pilih tanggal transaksi"
          value={state.date}
          onChange={handleFormChange}
          required
        />
        <Input
          id="note"
          name="note"
          type="text"
          label="Catatan"
          placeholder="Ketik catatan (opsional)"
          value={state.note}
          onChange={handleFormChange}
          error={errors.note}
        />
        <Input
          id="due_date"
          name="due_date"
          type="date"
          label="Tanggal Jatuh Tempo"
          placeholder="Pilih tanggal jatuh tempo (opsional)"
          value={state.due_date}
          onChange={handleFormChange}
        />
      </div>
      <footer className="mt-5 flex flex-col gap-3 items-center">
        <Button
          type="submit"
          block
          disabled={!isValid || Number(state.amount) <= 0}
          loading={loading}
        >
          {isEdit ? 'Simpan Perubahan' : 'Simpan'}
        </Button>
      </footer>
    </form>
  );
};

export default FormTransactionPage;
