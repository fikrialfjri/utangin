import { useNavigate, useParams } from 'react-router';

import type { IContactDetail, ITransaction } from '@/types/services';
import dayjs from 'dayjs';

import FloatButton from '@/components/shared/float-button';
import List from '@/components/shared/list';
import SummaryCard from '@/components/shared/summary-card';

import { useGet } from '@/hooks/use-services';

import { SUMMARY_CARD_VARIANTS, TRANSACTION_TYPES } from '@/libs/constants';

import { formatCurrency } from '@/utils/commons';

interface IGetContactDetail {
  data: IContactDetail;
}

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: contact }: IGetContactDetail = useGet(`/contact/${id}`);

  const statusLabel =
    contact?.status === TRANSACTION_TYPES.DEBT ? 'Hutang' : 'Piutang';

  const handleNavigateTransaction = () => {
    navigate({
      pathname: '/form/transaction/create',
      search: `contact_id=${id}`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <SummaryCard
        variant={SUMMARY_CARD_VARIANTS.CONTACT_DETAIL}
        data={{ nominal: contact?.net_total ?? 0 }}
        withColorValue
        centered
        withShadow
        titleClassName="typo-title-sm font-bold!"
        contactInfo={{
          name: contact?.name ?? '',
          avatar: contact?.avatar,
          status: contact?.status,
          description: `Pembayaran terakhir: ${
            contact?.last_transaction
              ? dayjs(contact.last_transaction).format('DD MMM YYYY')
              : '-'
          } (${statusLabel})`,
        }}
      />

      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          List Hutang / Piutang
        </h2>
        {contact?.transactions?.length ? (
          <List
            data={contact.transactions}
            renderItem={(item: ITransaction) => (
              <List.Item key={item.id} variant={item.type}>
                <div className="flex flex-col">
                  <h4 className="typo-body-md font-semibold! text-neutral-2">
                    {dayjs(item.date).format('DD MMMM YYYY')}
                  </h4>
                  {item.status === 'PAID' && (
                    <span className="typo-caption-sm text-neutral-3">
                      Pembayaran terakhir:{' '}
                      {dayjs(item.date).format('DD MMM YYYY')}
                    </span>
                  )}
                </div>
                {formatCurrency(item.amount)}
              </List.Item>
            )}
          />
        ) : null}
      </section>

      <FloatButton onClick={handleNavigateTransaction} />
    </div>
  );
};

export default ContactDetailPage;
