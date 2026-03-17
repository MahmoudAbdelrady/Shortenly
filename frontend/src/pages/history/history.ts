import { Component, inject, output, signal } from '@angular/core';
import { Funnel, History, LucideAngularModule, RotateCcw, Search } from 'lucide-angular';
import { CustomDropdown } from '../../components/custom-dropdown/custom-dropdown';
import { UrlItem } from '../../components/url-item/url-item';
import { Paginator } from '../../components/paginator/paginator';
import {
  DropdownOption,
  PageObj,
  ShortLinkRecord,
  ShortLinkSearch,
  ShortLinkStatistics,
} from '../../shared/types/general';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UrlShortenerService } from '../../service/url-shortener';
import { ToastService } from '../../service/toast';
import { Loading } from '../../components';
import { finalize } from 'rxjs';

const LINK_STATUS = { ALL: 'ALL', ACTIVE: 'ACTIVE', EXPIRED: 'EXPIRED' } as const;
type LinkStatus = (typeof LINK_STATUS)[keyof typeof LINK_STATUS];

@Component({
  selector: 'app-history',
  imports: [LucideAngularModule, CustomDropdown, UrlItem, Paginator, ReactiveFormsModule, Loading],
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

  private urlShortenerService = inject(UrlShortenerService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  protected isLoading = signal(false);
  protected isStatisticsLoading = signal(false);
  protected urlSearchForm = this.formBuilder.group({
    search: this.formBuilder.control('', { nonNullable: true }),
    status: this.formBuilder.control(LINK_STATUS.ALL as LinkStatus, { nonNullable: true }),
  });
  protected shortLinks = signal<ShortLinkRecord[]>([]);
  protected shortLinksPageInfo = signal<PageObj>({
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  protected shortLinksStatistics = signal<ShortLinkStatistics>({
    totalLinks: 0,
    activeLinks: 0,
    disabledLinks: 0,
  });

  constructor() {
    this.search({});
    this.getStatistics();
  }

  protected onLinkStatusChange(value: string) {
    this.urlSearchForm.patchValue({ status: value as LinkStatus });
  }

  protected onSubmit() {
    this.urlSearchForm.markAllAsTouched();
    if (this.urlSearchForm.invalid) return;
    this.search(this.getSearchFormData());
  }

  protected onReset() {
    this.urlSearchForm.reset();
    this.search({});
  }

  private getSearchFormData(): ShortLinkSearch {
    return {
      url: this.urlSearchForm.value.search ?? '',
      isActive:
        this.urlSearchForm.value.status === LINK_STATUS.ALL
          ? undefined
          : this.urlSearchForm.value.status === LINK_STATUS.ACTIVE,
    };
  }

  private getStatistics() {
    this.isStatisticsLoading.set(true);
    this.urlShortenerService
      .statistics()
      .pipe(finalize(() => this.isStatisticsLoading.set(false)))
      .subscribe({
        next: (result) => {
          this.shortLinksStatistics.set(result);
        },
        error: (error) => {
          this.toastService.show(error.error?.message ?? 'Failed to load statistics');
        },
      });
  }

  private search(search: ShortLinkSearch) {
    this.isLoading.set(true);
    this.urlShortenerService
      .search(search)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => {
          this.shortLinks.set(result.content);
          this.shortLinksPageInfo.set(result.page);
        },
        error: (error) => {
          this.toastService.show(error.error?.message ?? 'Failed to search links');
        },
      });
  }

  protected onLinkDeactivated() {
    this.getStatistics();
  }

  protected onPageChange(page: number) {
    this.shortLinksPageInfo.set({ ...this.shortLinksPageInfo(), number: page });
    this.search({ ...this.getSearchFormData(), page });
  }
}
