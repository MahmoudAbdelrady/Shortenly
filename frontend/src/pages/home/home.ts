import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { ShortenForm, ShortenResult } from '../../components';
import { UrlShortenerService } from '../../service/url-shortener';
import { ToastService } from '../../service/toast';
import { ShortenFormData, ShortLinkResult } from '../../shared/types/general';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, ShortenForm, ShortenResult],
  templateUrl: 'home.html',
  styleUrl: 'home.scss',
})
export class HomeComponent {
  private urlShortenerService = inject(UrlShortenerService);
  private toastService = inject(ToastService);
  protected readonly SparklesIcon = Sparkles;
  protected shortenResult = signal<ShortLinkResult | undefined>(undefined);
  protected isShortening = signal(false);

  protected onShorten(data: ShortenFormData) {
    this.isShortening.set(true);
    this.urlShortenerService.shorten(data).pipe(
      finalize(() => this.isShortening.set(false))
    ).subscribe({
      next: (result) => {
        this.shortenResult.set(result);
      },
      error: (error) => {
        this.toastService.show(error.error?.message ?? 'Failed to shorten URL');
      },
    });
  }

  protected onShortenAnother() {
    this.shortenResult.set(undefined);
  }
}
