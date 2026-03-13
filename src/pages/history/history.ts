import { Component } from '@angular/core';
import { Funnel, History, LucideAngularModule, Search } from 'lucide-angular';
import { CustomDropdown } from '../../components/custom-dropdown/custom-dropdown';
import { UrlItem } from '../../components/url-item/url-item';
import { DropdownOption } from '../../shared/types/general';

@Component({
  selector: 'app-history',
  imports: [LucideAngularModule, CustomDropdown, UrlItem],
  templateUrl: 'history.html',
  styleUrl: 'history.scss',
})
export class HistoryComponent {
  protected readonly HistoryIcon = History;
  protected readonly SearchIcon = Search;
  protected readonly FilterIcon = Funnel;
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
