import { usePageTitle } from '@/hooks/use-page-header';
import { useGlobalFilter } from '@/hooks/use-global-filter';
import Switch from '@/components/shared/switch';

const Setting = () => {
  usePageTitle('Pengaturan');
  const { hidePaid, toggleHidePaid } = useGlobalFilter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-primary-50 p-4 rounded-[18px] shadow-primary-3">
        <div>
          <h3 className="typo-title-md font-bold! text-neutral-2">Sembunyikan Transaksi Lunas</h3>
          <p className="typo-body-sm text-neutral-3 mt-1">Seluruh list hanya akan menampilkan transaksi aktif secara default.</p>
        </div>
        <Switch
          checked={hidePaid}
          onCheckedChange={toggleHidePaid}
        />
      </div>
    </div>
  );
};

export default Setting;
