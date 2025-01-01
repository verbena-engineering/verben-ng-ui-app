
import { ColumnDefinition } from 'verben-ng-ui/src/public-api';
import { MessageEmail } from '../model/MessageEmail';

export const columns: ColumnDefinition<MessageEmail>[] = [
  {
    id: 'select',
    header: '',
    accessorKey: 'Checked',
  },
  {
    id: 'mailHost',
    header: 'Mail Host',
    accessorKey: 'MailHost',
  },
  {
    id: 'inboundHost',
    header: 'Inbound Host',
    accessorKey: 'InboundHost'
  },
  {
    id: 'outboundHost',
    header: 'Outbound Host',
    accessorKey: 'OutboundHost',
  },
  {
    id: 'mail',
    header: 'Mail',
    accessorKey: 'Mail',
  },
  {
    id: 'user',
    header: 'User',
    accessorKey: 'User',
  },
  {
    id: 'password',
    header: 'Password',
    accessorKey: 'Password',
  },
  {
    id: 'enabled',
    header: 'Enabled',
    accessorKey: 'Enabled',
  },
  {
    id: 'secured',
    header: 'Secured',
    accessorKey: 'Secured',
  },
  {
    id: 'action',
    header: 'Action',
    accessorKey: 'Action',
  }
];
