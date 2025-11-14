class SummaryResponse {
  nominal: number;
  recent_contacts?: {
    name: string;
    avatar?: string | null;
  } | null;
}

export class DashboardSummaryResponse {
  potential: SummaryResponse;
  current: SummaryResponse;
  receivable_debt: SummaryResponse;
  debt: SummaryResponse;
  receivable: SummaryResponse;
}
