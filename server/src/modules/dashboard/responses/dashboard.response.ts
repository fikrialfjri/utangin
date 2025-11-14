import { ContactResponse } from 'src/modules/contact/responses/contact.response';

class SummaryResponse {
  nominal: number;
  recent_contacts?: ContactResponse[];
}

export class DashboardSummaryResponse {
  potential: SummaryResponse;
  current: SummaryResponse;
  receivable_debt: SummaryResponse;
  debt: SummaryResponse;
  receivable: SummaryResponse;
}
