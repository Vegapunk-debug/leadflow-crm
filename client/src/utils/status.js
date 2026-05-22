export const STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
];

export const STATUS_FILTERS = ['All', ...STATUSES];

export function statusClass(status) {
  switch (status) {
    case 'New':
      return 'status-new';
    case 'Contacted':
      return 'status-contacted';
    case 'Qualified':
      return 'status-qualified';
    case 'Proposal Sent':
      return 'status-proposalsent';
    case 'Won':
      return 'status-won';
    case 'Lost':
      return 'status-lost';
    default:
      return 'status-new';
  }
}
