import { useNavigate } from 'react-router';

import dayjs from 'dayjs';

import type { IDashboardSummary, IGroupedTransaction } from '@/types/services';

import Empty from '@/components/shared/empty';
import FloatButton from '@/components/shared/float-button';
import List from '@/components/shared/list';
import SummaryCard from '@/components/shared/summary-card';

import { useGet } from '@/hooks/use-services';

import {
  EMPTY_STATE_VARIANTS,
  SUMMARY_CARD_VARIANTS,
  TRANSACTION_TYPES,
} from '@/libs/constants';


interface IGetSummary {
  data: IDashboardSummary;
}

interface IGetTransaction {
  data: IGroupedTransaction[];
}

const DebtPage = () => {
  const navigate = useNavigate();

  const { data: summaryData }: IGetSummary = useGet('/dashboard/summary');
  const { data }: IGetTransaction = useGet('/transaction', {
    group_by: 'month',
    type: TRANSACTION_TYPES.DEBT,
  });

  const handleNavigateTransaction = () => {
    navigate({
      pathname: '/form/transaction/create',
      search: `transaction_type=${TRANSACTION_TYPES.DEBT}`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <SummaryCard
        variant={SUMMARY_CARD_VARIANTS.DEBT}
        data={summaryData?.debt}
        centered
        withShadow
        titleClassName="typo-title-sm font-bold!"
        withoutRecentContacts
      />
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          Hutang Saya
        </h2>
        {!data?.length ? (
          <Empty
            variant={EMPTY_STATE_VARIANTS.DEBT}
            onButtonClick={handleNavigateTransaction}
            showButton
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {data?.map((dt) => (
              <li key={dt.month} className="flex flex-col gap-3">
                <h6 className="typo-caption-md font-semibold text-neutral-3">
                  {dt.label}
                </h6>
                <List
                  data={dt.transactions}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      variant={item.type}
                      withProgress
                      percentage={item.percentage}
                      onClick={() => navigate(`/transaction/${item.id}`)}
                    >
                      <List.Item.Meta
                        avatar={{
                          src: item.contact.avatar,
                          name: item.contact.name,
                        }}
                        title={item.contact.name}
                        description={dayjs(item.date).format('DD MMM YYYY')}
                      />
                      <List.Item.TransactionNominal
                        status={item.status}
                        type={item.type}
                        amount={item.amount}
                        remaining={item.remaining}
                        totalPaid={item.total_paid}
                      />
                    </List.Item>
                  )}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <FloatButton onClick={handleNavigateTransaction} />
    </div>
  );
};

export default DebtPage;
