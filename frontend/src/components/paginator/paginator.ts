import { Component, computed, input, output, signal } from '@angular/core';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'paginator',
  imports: [LucideAngularModule],
  templateUrl: 'paginator.html',
  styleUrl: 'paginator.scss',
})
export class Paginator {
  public currentPage = input.required<number>();
  public pageSize = input.required<number>();
  public totalItems = input.required<number>();
  public pageChange = output<number>();

  protected readonly PrevIcon = ChevronLeft;
  protected readonly NextIcon = ChevronRight;

  protected readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize()),
  );

  protected readonly rangeStart = computed(
    () => (this.currentPage() - 1) * this.pageSize() + 1,
  );

  protected readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );

  protected goToPageValue = signal('');

  protected goToPage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  protected onGoToPage() {
    const page = parseInt(this.goToPageValue(), 10);
    if (!isNaN(page)) {
      this.goToPage(page);
    }
    this.goToPageValue.set('');
  }
}
