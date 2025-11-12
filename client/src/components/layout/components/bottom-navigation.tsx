import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { getNavItem, joinClassnames } from '@/utils/common';

import ContactIconActive from '@/assets/icons/contact-active.svg?react';
import ContactIcon from '@/assets/icons/contact.svg?react';
import DebtIcon from '@/assets/icons/debt.svg?react';
import HomeIconActive from '@/assets/icons/home-active.svg?react';
import HomeIcon from '@/assets/icons/home.svg?react';
import ReceivableIcon from '@/assets/icons/receivable.svg?react';
import SettingIcon from '@/assets/icons/setting.svg?react';

const BottomNavigation = () => {
  const location = useLocation();

  const [selectedMenu, setSelectedMenu] = useState<string>('/');

  const navItems = [
    getNavItem('Home', '/', HomeIcon, HomeIconActive),
    getNavItem('Hutang', '/debt', DebtIcon),
    getNavItem('Piutang', '/receivable', ReceivableIcon),
    getNavItem('Kontak', '/contact', ContactIcon, ContactIconActive),
    getNavItem('Pengaturan', '/setting', SettingIcon),
  ];

  useEffect(() => {
    setSelectedMenu(location.pathname);
  }, [location]);

  return (
    <nav className="bg-white fixed z-50 w-full max-w-xl -translate-x-1/2 bottom-0 left-1/2 grid grid-cols-5 px-3 pb-4 pt-5 border-t border-t-neutral-5 rounded-t-4xl">
      {navItems.map((item, i) => {
        const isSelected = selectedMenu === item.key;

        let ChosenIcon = item.icon;
        if (isSelected && item.iconActive) {
          ChosenIcon = item.iconActive;
        }

        return (
          <div key={i + item.key} className="flex items-center justify-center">
            <button
              className={joinClassnames([
                'flex flex-col gap-1.5 items-center justify-center cursor-pointer duration-200',
                isSelected
                  ? 'text-primary'
                  : 'text-neutral-4 hover:text-primary-300',
              ])}
              onClick={() => setSelectedMenu(item.key)}
            >
              {ChosenIcon ? <ChosenIcon /> : null}
              <p
                className={joinClassnames([
                  'typo-caption-md',
                  isSelected ? 'font-semibold!' : 'font-normal',
                ])}
              >
                {item.label}
              </p>
            </button>
          </div>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
