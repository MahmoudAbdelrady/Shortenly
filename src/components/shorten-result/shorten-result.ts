import { Component, output, signal } from '@angular/core';
import { Check, Copy, Infinity, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'shorten-result',
  imports: [LucideAngularModule],
  templateUrl: 'shorten-result.html',
  styleUrl: 'shorten-result.scss',
})
export class ShortenResult {
  protected readonly CheckIcon = Check;
  protected readonly CopyIcon = Copy;
  protected readonly InfinityIcon = Infinity;

  protected shortUrl = signal('https://snip.ly/vtBpRa');
  public onShortenAnother = output<void>();

  protected onShortenAnotherClick(event: Event) {
    event.preventDefault();
    this.onShortenAnother.emit();
  }

  protected readonly copied = signal(false);

  protected async onCopyClick(event: Event) {
    event.preventDefault();
    await navigator.clipboard.writeText(this.shortUrl());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
