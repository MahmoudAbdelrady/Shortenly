import { Component, output } from '@angular/core';
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

  public onShortenAnother = output<void>();

  protected onShortenAnotherClick(event: Event) {
    event.preventDefault();
    this.onShortenAnother.emit();
  }
}
