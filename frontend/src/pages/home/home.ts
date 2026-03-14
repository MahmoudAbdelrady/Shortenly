import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { ShortenForm, ShortenResult } from '../../components';
import { UrlShortenerService } from '../../service/url-shortener';
import { ShortenFormData, ShortLinkResult } from '../../shared/types/general';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, ShortenForm, ShortenResult],
  templateUrl: 'home.html',
  styleUrl: 'home.scss',
})
export class HomeComponent {
  private urlShortenerService = inject(UrlShortenerService);
  protected readonly SparklesIcon = Sparkles;
  protected shortenResult = signal<ShortLinkResult | undefined>(undefined);

  protected onShorten(data: ShortenFormData) {
    this.urlShortenerService.shorten(data).subscribe({
      next: (result) => {
        this.shortenResult.set(result);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  protected onShortenAnother() {
    this.shortenResult.set(undefined);
  }
}
