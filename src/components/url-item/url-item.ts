import { Component, input } from '@angular/core';
import {
  Ban,
  Clock4,
  Copy,
  ExternalLink,
  Funnel,
  History,
  LucideAngularModule,
  MousePointerClick,
  Search,
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
  protected readonly BanIcon = Ban;
  protected readonly expiryDurationOptions = expiryDurationOptions;

  public isActive = input.required<boolean>();
  public shortUrl = input.required<string>();
  public originalUrl = input.required<string>();
  public clicks = input.required<number>();
  public urlType = input.required<string>();
  public createdAt = input.required<string>();
  public expiresAt = input.required<string>();
}
