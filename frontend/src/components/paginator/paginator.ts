import { Component, computed, input, output, signal } from '@angular/core';
import {
  LucideChevronLeft as ChevronLeft,
  LucideChevronRight as ChevronRight,
  LucideDynamicIcon,
} from '@lucide/angular';

@Component({
  selector: 'paginator',
  imports: [LucideDynamicIcon],
  templateUrl: 'paginator.html',
  styleUrl: 'paginator.scss',
})
export class Paginator {
  public currentPage = input.required<number>();
  public pageSize = input.required<number>();
  public totalItems = input.required<number>();
  public totalPages = input.required<number>();
  public pageChange = output<number>();

  protected readonly PrevIcon = ChevronLeft;
  protected readonly NextIcon = ChevronRight;

  protected readonly displayPage = computed(() => this.currentPage() + 1);

  protected readonly rangeStart = computed(() => this.currentPage() * this.pageSize() + 1);

  protected readonly rangeEnd = computed(() =>
    Math.min((this.currentPage() + 1) * this.pageSize(), this.totalItems()),
  );

  protected goToPageValue = signal('');

  protected goToPage(page: number) {
    if (page < 0 || page >= this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  protected onGoToPage() {
    const page = parseInt(this.goToPageValue(), 10);
    if (!isNaN(page)) {
      this.goToPage(page - 1);
    }
    this.goToPageValue.set('');
  }
}
