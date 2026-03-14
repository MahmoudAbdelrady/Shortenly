import { Component, inject, output, signal } from '@angular/core';
import { Funnel, History, LucideAngularModule, RotateCcw, Search } from 'lucide-angular';
import { CustomDropdown } from '../../components/custom-dropdown/custom-dropdown';
import { UrlItem } from '../../components/url-item/url-item';
import { Paginator } from '../../components/paginator/paginator';
import { DropdownOption } from '../../shared/types/general';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

const LINK_STATUS = { ALL: 'ALL', ACTIVE: 'ACTIVE', EXPIRED: 'EXPIRED' } as const;
type LinkStatus = (typeof LINK_STATUS)[keyof typeof LINK_STATUS];

interface UrlSearchFormData {
  search: string;
  status: LinkStatus;
}

@Component({
  selector: 'app-history',
  imports: [LucideAngularModule, CustomDropdown, UrlItem, Paginator, ReactiveFormsModule],
  templateUrl: 'history.html',
  styleUrl: 'history.scss',
})
export class HistoryComponent {
  protected readonly HistoryIcon = History;
  protected readonly SearchIcon = Search;
  protected readonly FilterIcon = Funnel;
  protected readonly ResetIcon = RotateCcw;
  protected readonly linkStatusOptions: DropdownOption[] = [
    {
      label: 'All links',
      value: LINK_STATUS.ALL,
    },
    {
      label: 'Active',
      value: LINK_STATUS.ACTIVE,
    },
    {
      label: 'Expired',
      value: LINK_STATUS.EXPIRED,
    },
  ];

  private formBuilder = inject(FormBuilder);
  protected urlSearchForm = this.formBuilder.group({
    search: [''],
    status: [LINK_STATUS.ALL as LinkStatus],
  });

  protected onLinkStatusChange(value: string) {
    this.urlSearchForm.patchValue({ status: value as LinkStatus });
  }

  protected onSubmit() {
    this.urlSearchForm.markAllAsTouched();
    if (this.urlSearchForm.invalid) return;
    const formData: UrlSearchFormData = {
      search: this.urlSearchForm.value.search ?? '',
      status: this.urlSearchForm.value.status ?? LINK_STATUS.ALL,
    };
    console.log({ formData });
    // todo: send to api
  }

  protected onReset() {
    this.urlSearchForm.reset();
    // todo: send to api
  }

  protected currentPage = signal(1);
  protected pageSize = signal(10);
  protected totalItems = signal(56);

  protected onPageChange(page: number) {
    this.currentPage.set(page);
    // todo: fetch page data from api
  }
}
