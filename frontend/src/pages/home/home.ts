import { Component, signal } from '@angular/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { ShortenForm, ShortenResult } from '../../components';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, ShortenForm, ShortenResult],
  templateUrl: 'home.html',
  styleUrl: 'home.scss',
})
export class HomeComponent {
  protected readonly SparklesIcon = Sparkles;
  protected showResult = signal(false);

  protected onShorten() {
    this.showResult.set(true);
  }

  protected onShortenResult() {
    this.showResult.set(false);
  }
}
