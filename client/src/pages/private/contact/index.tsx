import { useNavigate } from 'react-router';

import dayjs from 'dayjs';

import type { IContact, IDashboardSummary } from '@/types/services';

import Accordion from '@/components/shared/accordion';
import Badge from '@/components/shared/badge';
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

import { formatCurrency } from '@/utils/commons';

interface IGetSummary {
  data: IDashboardSummary;
}

interface IGetContact {
  data: IContact[];
}

const getTransactionLabel = (status?: string) =>
  status === TRANSACTION_TYPES.DEBT ? 'Hutang' : 'Piutang';

const ContactPage = () => {
  const navigate = useNavigate();

  const { data: summaryData }: IGetSummary = useGet('/dashboard/summary');
  const { data }: IGetContact = useGet('/contact');

  const sortByTransaction = (a: IContact, b: IContact) => {
    if (a.last_transaction && b.last_transaction)
      return (
        new Date(b.last_transaction).getTime() -
        new Date(a.last_transaction).getTime()
      );
    if (a.last_transaction) return -1;
    if (b.last_transaction) return 1;
    return b.id - a.id;
  };

  const activeContacts =
    data?.filter((c) => c.has_active_transactions).sort(sortByTransaction) ??
    [];
  const inactiveContacts =
    data?.filter((c) => !c.has_active_transactions).sort(sortByTransaction) ??
    [];

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
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          Kontak dengan Transaksi Aktif
        </h2>
        {!data?.length ? (
          <Empty
            variant={EMPTY_STATE_VARIANTS.CONTACT}
            onButtonClick={() => navigate('/form/contact/create')}
            showButton
          />
        ) : (
          <div className="flex flex-col gap-3">
            {activeContacts.length > 0 && (
              <List
                data={activeContacts}
                renderItem={(item: IContact, idx: number) => (
                  <List.Item key={item.id ?? idx} variant={item.status}>
                    <div
                      className="flex flex-1 cursor-pointer items-center justify-between gap-3"
                      onClick={() => navigate(`/contact/${item.id}`)}
                    >
                      <List.Item.Meta
                        avatar={{
                          src: item.avatar,
                          name: item.name,
                        }}
                        title={item.name}
                        description={
                          item.last_transaction
                            ? `Transaksi terakhir: ${dayjs(item.last_transaction).format('DD MMM YYYY')} (${getTransactionLabel(item.status)})`
                            : undefined
                        }
                      />
                      {formatCurrency(item.net_total ?? 0)}
                    </div>
                  </List.Item>
                )}
              />
            )}

            {inactiveContacts.length > 0 && (
              <Accordion
                title={`Kontak dengan Transaksi Tidak Aktif (${inactiveContacts.length})`}
              >
                <List
                  data={inactiveContacts}
                  renderItem={(item: IContact, idx: number) => (
                    <List.Item key={item.id ?? idx}>
                      <div
                        className="flex flex-1 cursor-pointer items-center justify-between gap-3"
                        onClick={() => navigate(`/contact/${item.id}`)}
                      >
                        <List.Item.Meta
                          avatar={{
                            src: item.avatar,
                            name: item.name,
                          }}
                          title={item.name}
                          description={
                            item.last_transaction
                              ? `Transaksi terakhir: ${dayjs(item.last_transaction).format('DD MMM YYYY')} (${getTransactionLabel(item.status)})`
                              : 'Belum ada transaksi'
                          }
                        />
                        {item.last_transaction && (
                          <Badge variant="success">Lunas</Badge>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </Accordion>
            )}
          </div>
        )}
      </section>

      <FloatButton onClick={() => navigate('/form/contact/create')} />
    </div>
  );
};

export default ContactPage;
