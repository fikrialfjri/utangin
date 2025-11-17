import { useEffect, useState } from 'react';

import SummaryCard from '@/components/shared/summary-card';

import instance from '@/utils/axios-instance';

type Summary = {
  potential: { nominal: number };
  current: { nominal: number };
  receivable_debt: { nominal: number };
  debt: { nominal: number };
  receivable: { nominal: number };
};

const defaultSummary: Summary = {
  potential: { nominal: 0 },
  current: { nominal: 0 },
  receivable_debt: { nominal: 0 },
  debt: { nominal: 0 },
  receivable: { nominal: 0 },
};

const HomePage = () => {
  const [summaryData, setSummaryData] = useState<Summary>(defaultSummary);

  useEffect(() => {
    _fetchData();
  }, []);

  const _fetchData = async () => {
    try {
      const res = await instance.get('/dashboard/summary');
      setSummaryData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default HomePage;
