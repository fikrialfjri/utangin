import type { IContact } from '@/types/services';
import dayjs from 'dayjs';

import List from '@/components/shared/list';

import { useGet } from '@/hooks/use-services';

import { formatCurrency } from '@/utils/commons';

interface IGetContact {
  data: IContact[];
}

const ContactPage = () => {
  const { data }: IGetContact = useGet('/contact');

  return (
    <div>
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold!">Orang / Pihak Terkait</h2>
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
      </section>
    </div>
  );
};

export default ContactPage;
