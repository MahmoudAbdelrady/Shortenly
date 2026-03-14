import { Clock, Infinity as InfinityIcon, LucideIconData, Ticket } from 'lucide-angular';

export interface DropdownOption {
  icon?: LucideIconData;
  label: string;
  value: string;
}

export const expiryDurationOptions: DropdownOption[] = [
  { icon: Ticket, label: 'One time', value: 'ONE_TIME' },
  { icon: InfinityIcon, label: 'Never expires', value: 'NEVER_EXPIRES' },
  { icon: Clock, label: '5 min', value: '5_MIN' },
  { icon: Clock, label: '10 min', value: '10_MIN' },
  { icon: Clock, label: '15 min', value: '15_MIN' },
  { icon: Clock, label: '20 min', value: '20_MIN' },
  { icon: Clock, label: '25 min', value: '25_MIN' },
  { icon: Clock, label: '30 min', value: '30_MIN' },
  { icon: Clock, label: '45 min', value: '45_MIN' },
  { icon: Clock, label: '1 hr', value: '1_HR' },
  { icon: Clock, label: '2 hrs', value: '2_HR' },
  { icon: Clock, label: '6 hrs', value: '6_HR' },
  { icon: Clock, label: '12 hrs', value: '12_HR' },
  { icon: Clock, label: '24 hrs', value: '24_HR' },
];
