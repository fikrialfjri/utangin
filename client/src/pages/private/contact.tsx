import type { IContact } from '@/types/services';

import List from '@/components/shared/list';

import { useGet } from '@/hooks/use-services';

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
            <List.Item key={item.id ?? idx} variant="receivable">
              <List.Item.Meta
                avatar={{
                  src: item.avatar,
                  name: item.name,
                }}
                title={item.name}
                description="Transaksi terakhir: 05 Okt 2025"
              />
              {/* {item.nominal} */}
            </List.Item>
          )}
        />
      </section>
    </div>
  );
};

export default ContactPage;
