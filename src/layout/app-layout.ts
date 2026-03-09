import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: 'app-layout.html',
  styleUrl: 'app-layout.scss',
  imports: [RouterOutlet],
})
export class AppLayoutComponent {}
