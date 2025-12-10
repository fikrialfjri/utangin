import { useNavigate } from 'react-router';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import InputCurrency from '@/components/shared/input-currency';
import RadioGroup from '@/components/shared/radio-group';
import Select from '@/components/shared/select';

import useForm from '@/hooks/use-form';
import { useGet, usePost } from '@/hooks/use-services';

import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '@/libs/constants';

import { generateOptions, removeEmptyFields } from '@/utils/commons';

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

  const { state, errors, handleFormChange, setFieldValue, resetForm, isValid } =
    useForm(
      {
        contact_id: null,
        type: TRANSACTION_TYPES.DEBT,
        status: TRANSACTION_STATUS.ACTIVE,
        amount: 0,
        date: '',
        description: '',
        due_date: '',
      },
      { requiredFields: ['contact_id', 'type', 'amount', 'date', 'status'] },
    );

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

  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!isValid) return;

        state['amount'] = Number(state['amount']);

        await handlePost(removeEmptyFields(state));
      }}
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
          id="description"
          name="description"
          type="text"
          label="Catatan"
          placeholder="Ketik catatan (opsional)"
          value={state.description}
          onChange={handleFormChange}
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
        <Button type="submit" block disabled={!isValid} loading={loadingPost}>
          Simpan
        </Button>
      </footer>
    </form>
  );
};

export default FormTransactionPage;
