import type { IDashboardSummary, IGroupedTransaction } from '@/types/services';
import dayjs from 'dayjs';

import List from '@/components/shared/list';
import SummaryCard from '@/components/shared/summary-card';

import { useGet } from '@/hooks/use-services';

interface IGetSummary {
  data: IDashboardSummary;
}

interface IGetTransaction {
  data: IGroupedTransaction[];
}

const HomePage = () => {
  const { data: summaryData }: IGetSummary = useGet('/dashboard/summary');
  const { data: transactionData }: IGetTransaction = useGet('/transaction', {
    group_by: 'month',
  });

  return (
    <div className="flex flex-col gap-3">
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard
          variant="potential"
          data={summaryData?.potential}
          className="col-span-2"
          withShadow
        />
        <SummaryCard variant="current" data={summaryData?.current} />
        <SummaryCard
          variant="receivable-debt"
          data={summaryData?.receivable_debt}
          withColorValue
        />
        <SummaryCard variant="debt" data={summaryData?.debt} />
        <SummaryCard variant="receivable" data={summaryData?.receivable} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          Transaksi
        </h2>
        <ul className="flex flex-col gap-3">
          {transactionData?.map((dt) => (
            <li key={dt.month} className="flex flex-col gap-3">
              <h6 className="typo-caption-md font-semibold text-neutral-3">
                {dt.label}
              </h6>
              <List
                data={dt.transactions}
                renderItem={(item) => (
                  <List.Item key={item.id} variant={item.type.toLowerCase()}>
                    <List.Item.Meta
                      avatar={{
                        src: item.contact.avatar,
                        name: item.contact.name,
                      }}
                      title={item.contact.name}
                      description={dayjs(item.contact.date).format(
                        'DD MMM YYYY',
                      )}
                    />
                    Rp{item.amount.toLocaleString()}
                  </List.Item>
                )}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
