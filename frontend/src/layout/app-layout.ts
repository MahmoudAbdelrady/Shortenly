import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideHouse as House,
  LucideDynamicIcon,
  LucideIconInput,
  LucideRotateCcwClock as History,
} from '@lucide/angular';

interface AppTab {
  label: string;
  icon: LucideIconInput;
  route: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: 'app-layout.html',
  styleUrl: 'app-layout.scss',
  imports: [RouterOutlet, RouterLink, LucideDynamicIcon, RouterLinkActive],
})
export class AppLayoutComponent {
  protected readonly appTabs: AppTab[] = [
    {
      label: 'Home',
      icon: House,
      route: '/',
    },
    {
      label: 'History',
      icon: History,
      route: '/history',
    },
  ];
  protected readonly currentYear = new Date().getFullYear();
}
