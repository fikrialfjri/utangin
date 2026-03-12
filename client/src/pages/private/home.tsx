import { useNavigate } from 'react-router';

import type { IDashboardSummary, IGroupedTransaction } from '@/types/services';
import dayjs from 'dayjs';

import Empty from '@/components/shared/empty';
import Badge from '@/components/shared/badge';
import FloatButton from '@/components/shared/float-button';
import List from '@/components/shared/list';
import SummaryCard from '@/components/shared/summary-card';

import { useGet } from '@/hooks/use-services';

import { EMPTY_STATE_VARIANTS, SUMMARY_CARD_VARIANTS } from '@/libs/constants';

import { formatCurrency } from '@/utils/commons';

interface IGetSummary {
  data: IDashboardSummary;
}

interface IGetTransaction {
  data: IGroupedTransaction[];
}

const HomePage = () => {
  const navigate = useNavigate();

  const { data: summaryData }: IGetSummary = useGet('/dashboard/summary');
  const { data: transactionData }: IGetTransaction = useGet('/transaction', {
    group_by: 'month',
  });

  return (
    <div className="flex flex-col gap-3">
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard
          variant={SUMMARY_CARD_VARIANTS.POTENTIAL}
          data={summaryData?.potential}
          className="col-span-2"
          withShadow
        />
        <SummaryCard
          variant={SUMMARY_CARD_VARIANTS.CURRENT}
          data={summaryData?.current}
        />
        <SummaryCard
          variant={SUMMARY_CARD_VARIANTS.RECEIVABLE_DEBT}
          data={summaryData?.receivable_debt}
          withColorValue
        />
        <SummaryCard
          variant={SUMMARY_CARD_VARIANTS.DEBT}
          data={summaryData?.debt}
        />
        <SummaryCard
          variant={SUMMARY_CARD_VARIANTS.RECEIVABLE}
          data={summaryData?.receivable}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          Transaksi
        </h2>
        {!transactionData?.length ? (
          <Empty
            variant={EMPTY_STATE_VARIANTS.TRANSACTION}
            onButtonClick={() => navigate('/form/transaction/create')}
            showButton
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {transactionData?.map((dt) => (
              <li key={dt.month} className="flex flex-col gap-3">
                <h6 className="typo-caption-md font-semibold text-neutral-3">
                  {dt.label}
                </h6>
                <List
                  data={dt.transactions}
                  renderItem={(item) => (
                    <div
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/transaction/${item.id}`)}
                    >
                      <List.Item variant={item.type}>
                        <List.Item.Meta
                          avatar={{
                            src: item.contact.avatar,
                            name: item.contact.name,
                          }}
                          title={item.contact.name}
                          description={dayjs(item.date).format('DD MMM YYYY')}
                        />
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className={
                              item.status === 'PAID'
                                ? 'line-through text-neutral-3'
                                : ''
                            }
                          >
                            {formatCurrency(item.amount)}
                          </span>
                          {item.status === 'PAID' && (
                            <Badge variant="success">Lunas</Badge>
                          )}
                        </div>
                      </List.Item>
                    </div>
                  )}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <FloatButton onClick={() => navigate('/form/transaction/create')} />
    </div>
  );
};

export default HomePage;
