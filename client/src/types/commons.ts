import type { ComponentType, ReactNode } from 'react';

export type StringMap = { [key: string]: string };
export type ReactNodeMap = { [key: string]: ReactNode };

export interface NavItem {
  label: string;
  key: string;
  icon?: ComponentType<{ className?: string }>;
  iconActive?: ComponentType<{ className?: string }>;
}

export interface IContact {
  id: number;
  avatar?: string | null;
  name: string;
}

export interface ISummary {
  nominal: number;
  recent_contacts?: IContact[];
}
