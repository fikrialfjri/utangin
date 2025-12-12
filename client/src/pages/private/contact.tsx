import { useNavigate } from 'react-router';

import type { IContact, IDashboardSummary } from '@/types/services';
import dayjs from 'dayjs';

import Empty from '@/components/shared/empty';
import List from '@/components/shared/list';
import SummaryCard from '@/components/shared/summary-card';

import { useGet } from '@/hooks/use-services';

import { EMPTY_STATE_VARIANTS, SUMMARY_CARD_VARIANTS } from '@/libs/constants';

import { formatCurrency } from '@/utils/commons';

interface IGetSummary {
  data: IDashboardSummary;
}

interface IGetContact {
  data: IContact[];
}

const ContactPage = () => {
  const navigate = useNavigate();

  const { data: summaryData }: IGetSummary = useGet('/dashboard/summary');
  const { data }: IGetContact = useGet('/contact');

  return (
    <div className="flex flex-col gap-6">
      <SummaryCard
        variant={SUMMARY_CARD_VARIANTS.RECEIVABLE_DEBT}
        data={summaryData?.receivable_debt}
        withColorValue
        centered
        withShadow
        titleClassName="typo-title-sm font-bold!"
      />
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold!">Orang / Pihak Terkait</h2>
        {!data?.length ? (
          <Empty
            variant={EMPTY_STATE_VARIANTS.CONTACT}
            onButtonClick={() => navigate('/form/contact/create')}
            showButton
          />
        ) : (
          <List
            data={data}
            renderItem={(item: IContact, idx: number) => (
              <List.Item key={item.id ?? idx} variant={item.status}>
                <List.Item.Meta
                  avatar={{
                    src: item.avatar,
                    name: item.name,
                  }}
                  title={item.name}
                  description={`Transaksi terakhir: ${dayjs(item.last_transaction).format('DD MMM YYYY')}`}
                />
                {formatCurrency(item.net_total ?? 0)}
              </List.Item>
            )}
          />
        )}
      </section>
    </div>
  );
};

export default ContactPage;
