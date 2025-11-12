import type { ComponentType } from 'react';

export interface NavItem {
  label: string;
  key: string;
  icon?: ComponentType<{ className?: string }>;
  iconActive?: ComponentType<{ className?: string }>;
}
