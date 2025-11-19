import { useEffect, useState } from 'react';

import type { ISummary, ITransaction } from '@/types/commons';
import dayjs from 'dayjs';

import List from '@/components/shared/list';
import SummaryCard from '@/components/shared/summary-card';

import instance from '@/utils/axios-instance';

interface Summary {
  potential: ISummary;
  current: ISummary;
  receivable_debt: ISummary;
  debt: ISummary;
  receivable: ISummary;
}

interface Transaction {
  month: string;
  label: string;
  transactions: ITransaction[];
}

const defaultSummary: Summary = {
  potential: { nominal: 0 },
  current: { nominal: 0 },
  receivable_debt: { nominal: 0 },
  debt: { nominal: 0 },
  receivable: { nominal: 0 },
};

const HomePage = () => {
  const [summaryData, setSummaryData] = useState<Summary>(defaultSummary);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);

  useEffect(() => {
    _fetchData();
  }, []);

  const _fetchData = async () => {
    try {
      const [resSummary, resTransaction] = await Promise.all([
        instance.get('/dashboard/summary'),
        instance.get('/transaction?group_by=month'),
      ]);
      setSummaryData(resSummary.data.data);
      setTransactionData(resTransaction.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard
          variant="potential"
          data={summaryData.potential}
          className="col-span-2"
          withShadow
        />
        <SummaryCard variant="current" data={summaryData.current} />
        <SummaryCard
          variant="receivable-debt"
          data={summaryData.receivable_debt}
          withColorValue
        />
        <SummaryCard variant="debt" data={summaryData.debt} />
        <SummaryCard variant="receivable" data={summaryData.receivable} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          Transaksi
        </h2>
        <ul className="flex flex-col gap-3">
          {transactionData.map((dt) => (
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
