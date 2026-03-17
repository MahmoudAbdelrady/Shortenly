import { Component, inject, input, linkedSignal, output, signal } from '@angular/core';
import {
  Ban,
  Check,
  Clock4,
  Copy,
  ExternalLink,
  Funnel,
  History,
  LucideAngularModule,
  MousePointerClick,
  Search,
  TriangleAlert,
} from 'lucide-angular';
import { expiryDurationOptions, ShortLinkRecord } from '../../shared/types/general';
import { UrlShortenerService } from '../../service/url-shortener';

@Component({
  selector: 'url-item',
  imports: [LucideAngularModule],
  templateUrl: 'url-item.html',
  styleUrl: 'url-item.scss',
})
export class UrlItem {
  protected readonly HistoryIcon = History;
  protected readonly SearchIcon = Search;
  protected readonly FilterIcon = Funnel;
  protected readonly ExternalLinkIcon = ExternalLink;
  protected readonly MousePointerClickIcon = MousePointerClick;
  protected readonly Clock4Icon = Clock4;
  protected readonly CopyIcon = Copy;
  protected readonly CheckIcon = Check;
  protected readonly BanIcon = Ban;
  protected readonly AlertTriangleIcon = TriangleAlert;
  protected readonly expiryDurationOptions = expiryDurationOptions;

  public linkInput = input.required<ShortLinkRecord>({ alias: 'link' });
  public link = linkedSignal(() => this.linkInput());
  public deactivated = output<ShortLinkRecord>();

  private readonly urlShortenerService = inject(UrlShortenerService);
  protected copied = signal(false);
  protected deactivateConfirmOpen = signal(false);

  protected async onCopyClick(event: Event) {
    event.preventDefault();
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
    await navigator.clipboard.writeText(this.link().shortUrl);
  }

  protected onDeactivateClick(event: Event) {
    event.preventDefault();
    this.deactivateConfirmOpen.set(true);
  }

  protected onDeactivateAction(deactivate: boolean) {
    this.deactivateConfirmOpen.set(false);
    if (deactivate) {
      this.urlShortenerService.deactivate(this.link().id).subscribe({
        next: (result) => {
          this.link.set(result);
          this.deactivated.emit(result);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
