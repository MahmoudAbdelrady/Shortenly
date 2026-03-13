import { Component } from '@angular/core';
import {
  ExternalLink,
  Funnel,
  History,
  LucideAngularModule,
  MousePointerClick,
  Search,
  Clock4,
  Copy,
  Ban,
} from 'lucide-angular';
import { CustomDropdown } from '../../components/custom-dropdown/custom-dropdown';
import { DropdownOption, expiryDurationOptions } from '../../shared/types/general';

@Component({
  selector: 'app-history',
  imports: [LucideAngularModule, CustomDropdown],
  templateUrl: 'history.html',
  styleUrl: 'history.scss',
})
export class HistoryComponent {
  protected readonly HistoryIcon = History;
  protected readonly SearchIcon = Search;
  protected readonly FilterIcon = Funnel;
  protected readonly ExternalLinkIcon = ExternalLink;
  protected readonly MousePointerClickIcon = MousePointerClick;
  protected readonly Clock4Icon = Clock4;
  protected readonly CopyIcon = Copy;
  protected readonly BanIcon = Ban;
  protected readonly expiryDurationOptions = expiryDurationOptions;
  protected readonly linkStatusOptions: DropdownOption[] = [
    {
      label: 'All links',
      value: 'ALL',
    },
    {
      label: 'Active',
      value: 'ACTIVE',
    },
    {
      label: 'Expired',
      value: 'EXPIRED',
    },
  ];
}
