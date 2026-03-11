import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import type { IPayment, ITransactionDetail } from '@/types/services';
import dayjs from 'dayjs';

import Button from '@/components/shared/button';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import Input from '@/components/shared/input';
import InputCurrency from '@/components/shared/input-currency';

import useForm from '@/hooks/use-form';
import { usePageTitle } from '@/hooks/use-page-header';
import { useDelete, useGet, usePost, usePut } from '@/hooks/use-services';

import { formatCurrency, removeEmptyFields } from '@/utils/commons';
import { valid } from '@/utils/validators';

const FormPaymentPage = () => {
  const navigate = useNavigate();
  const { id, paymentId } = useParams();
  const location = useLocation();

  const isEdit = !!paymentId;
  const remaining =
    (location.state as { remaining?: number } | null)?.remaining ?? 0;
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch transaction detail to get payment data for edit
  const { data: transaction } = useGet(
    `/transaction/${id}`,
    {},
    { shouldFetch: isEdit, saveQuery: false },
  ) as { data: ITransactionDetail | null };

  const editPayment = transaction?.payments?.find(
    (p: IPayment) => p.id === Number(paymentId),
  );

  usePageTitle(isEdit ? 'Edit Pembayaran' : 'Tambah Pembayaran');

  const maxAmount = isEdit ? remaining + (editPayment?.amount ?? 0) : remaining;

  const {
    state,
    errors,
    handleFormChange,
    setFormState,
    setFieldValue,
    resetForm,
    isValid,
  } = useForm(
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

  useEffect(() => {
    if (editPayment) {
      setFormState({
        amount: editPayment.amount,
        date: dayjs(editPayment.date).format('YYYY-MM-DD'),
        note: editPayment.note ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPayment]);

  const { handlePost, loadingPost } = usePost(`/transaction/${id}/payment`, {
    onSuccess: () => {
      navigate(`/transaction/${id}`);
      resetForm();
    },
  });

  const { handlePut, loadingPut } = usePut(
    `/transaction/${id}/payment/${paymentId}`,
    {
      onSuccess: () => {
        navigate(`/transaction/${id}`);
        resetForm();
      },
    },
  );

  const { handleDelete, loadingDelete } = useDelete(
    `/transaction/${id}/payment/${paymentId}`,
    {
      onSuccess: () => {
        navigate(`/transaction/${id}`);
      },
    },
  );

  const handleFullPayment = () => {
    const fullAmount = isEdit
      ? remaining + (editPayment?.amount ?? 0)
      : remaining;
    setFieldValue('amount', fullAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isExceeded) return;

    const payload = removeEmptyFields({
      ...state,
      amount: Number(state.amount),
    });

    if (isEdit) {
      await handlePut(payload);
    } else {
      await handlePost(payload);
    }
  };

  const loading = loadingPost || loadingPut;
  const isExceeded = maxAmount > 0 && Number(state.amount) > maxAmount;

  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        {remaining > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-primary/10 px-4 py-3">
            <div className="flex flex-col">
              <span className="typo-caption-sm text-neutral-3">
                Sisa Pembayaran
              </span>
              <span className="typo-body-md font-semibold! text-primary">
                {formatCurrency(remaining)}
              </span>
            </div>
            <Button type="button" size="sm" onClick={handleFullPayment}>
              Bayar Lunas
            </Button>
          </div>
        )}
        <InputCurrency
          id="jumlah"
          name="amount"
          label="Nominal"
          value={state.amount}
          onChange={handleFormChange}
          error={
            isExceeded
              ? `Nominal melebihi sisa pembayaran (${formatCurrency(maxAmount)})`
              : undefined
          }
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
          label="Catatan (opsional)"
          placeholder="Ketik catatan (opsional)"
          value={state.note}
          onChange={handleFormChange}
          error={errors.note}
          maxLength={64}
        />
      </div>
      <footer className="mt-5 flex flex-col gap-3 items-center">
        <Button
          type="submit"
          block
          disabled={!isValid || Number(state.amount) <= 0 || isExceeded}
          loading={loading}
        >
          {isEdit ? 'Simpan Perubahan' : 'Simpan Pembayaran'}
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="danger-link"
            onClick={() => setConfirmOpen(true)}
          >
            Hapus Pembayaran
          </Button>
        )}
      </footer>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete()}
        title="Yakin ingin menghapus pembayaran ini?"
        message="Data pembayaran yang dihapus tidak dapat dikembalikan."
        confirmLabel="Ya, Hapus"
        loading={loadingDelete}
      />
    </form>
  );
};

export default FormPaymentPage;
