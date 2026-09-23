import { Component, computed, input, output, signal } from '@angular/core';
import {
  LucideCheck as Check,
  LucideCopy as Copy,
  LucideDynamicIcon,
  LucideInfinity as Infinity,
} from '@lucide/angular';
import { expiryDurationOptions, ShortLinkResult } from '../../shared/types/general';

@Component({
  selector: 'shorten-result',
  imports: [LucideDynamicIcon],
  templateUrl: 'shorten-result.html',
  styleUrl: 'shorten-result.scss',
})
export class ShortenResult {
  protected readonly CheckIcon = Check;
  protected readonly CopyIcon = Copy;
  protected readonly InfinityIcon = Infinity;

  public result = input.required<ShortLinkResult>();
  public onShortenAnother = output<void>();
  protected resultData = computed(() => ({
    ...this.result(),
    expiryType: expiryDurationOptions.find((option) => option.value === this.result().expiryType)!,
  }));

  protected onShortenAnotherClick(event: Event) {
    event.preventDefault();
    this.onShortenAnother.emit();
  }

  protected readonly copied = signal(false);

  protected async onCopyClick(event: Event) {
    event.preventDefault();
    await navigator.clipboard.writeText(this.result().shortUrl);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
