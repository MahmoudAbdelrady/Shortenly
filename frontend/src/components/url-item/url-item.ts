import { Component, input, signal } from '@angular/core';
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
import { expiryDurationOptions } from '../../shared/types/general';

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

  public isActive = input.required<boolean>();
  public shortUrl = input.required<string>();
  public originalUrl = input.required<string>();
  public clicks = input.required<number>();
  public urlType = input.required<string>();
  public createdAt = input.required<string>();
  public expiresAt = input.required<string>();

  protected copied = signal(false);
  protected expireConfirmOpen = signal(false);

  protected async onCopyClick(event: Event) {
    event.preventDefault();
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
    await navigator.clipboard.writeText(this.shortUrl());
  }

  protected onExpireClick(event: Event) {
    event.preventDefault();
    this.expireConfirmOpen.set(true);
  }

  protected onExpireAction(expire: boolean) {
    this.expireConfirmOpen.set(false);
    if (expire) {
      // Todo: api call to expire the link
    }
  }
}
