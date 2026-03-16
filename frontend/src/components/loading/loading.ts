import { Component, input } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: 'loading.html',
  styleUrl: 'loading.scss',
})
export class Loading {
  size = input<'sm' | 'md'>('md');
}
