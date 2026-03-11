import { useNavigate, useParams } from 'react-router';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import InputCurrency from '@/components/shared/input-currency';

import useForm from '@/hooks/use-form';
import { usePost } from '@/hooks/use-services';

import { removeEmptyFields } from '@/utils/commons';
import { valid } from '@/utils/validators';

const FormPaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { state, errors, handleFormChange, resetForm, isValid } = useForm(
    {
      amount: 0,
      date: '',
      note: '',
    },
    {
      requiredFields: ['amount', 'date'],
      validators: {
        note: [valid.max('Catatan', 64)],
      },
    },
  );

  const { handlePost, loadingPost } = usePost(`/transaction/${id}/payment`, {
    onSuccess: () => {
      navigate(`/transaction/${id}`);
      resetForm();
    },
  });

  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!isValid) return;

        await handlePost(
          removeEmptyFields({
            ...state,
            amount: Number(state.amount),
          }),
        );
      }}
    >
      <div className="flex flex-col gap-5">
        <InputCurrency
          id="jumlah"
          name="amount"
          label="Jumlah Pembayaran"
          value={state.amount}
          onChange={handleFormChange}
          required
        />
        <Input
          id="date"
          name="date"
          type="date"
          label="Tanggal Pembayaran"
          placeholder="Pilih tanggal pembayaran"
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
      </div>
      <footer className="mt-5 flex flex-col gap-3 items-center">
        <Button
          type="submit"
          block
          disabled={!isValid || Number(state.amount) <= 0}
          loading={loadingPost}
        >
          Simpan Pembayaran
        </Button>
      </footer>
    </form>
  );
};

export default FormPaymentPage;
