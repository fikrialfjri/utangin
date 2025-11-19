import List from '@/components/shared/list';

const ContactPage = () => {
  return (
    <div>
      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold!">Orang / Pihak Terkait</h2>
        <List
          data={new Array(20).fill('Data kontak')}
          renderItem={(item, idx) => (
            <List.Item key={idx} variant="receivable">
              <List.Item.Meta
                avatar={{
                  src: 'https://avatar.iran.liara.run/public/boy',
                  name: 'Boy',
                }}
                title="Nama Kontak"
                description="Transaksi terakhir: 05 Okt 2025"
              />
              {item}
            </List.Item>
          )}
        />
      </section>
    </div>
  );
};

export default ContactPage;
