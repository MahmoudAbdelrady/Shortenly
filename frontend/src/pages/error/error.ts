import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LucideHouse as Home,
  LucideDynamicIcon,
  LucideIconInput,
  LucideLink2Off as Link2Off,
  LucideShieldAlert as ShieldAlert,
  LucideTriangleAlert as AlertTriangle,
} from '@lucide/angular';
import { map } from 'rxjs';

interface ErrorInfo {
  icon: LucideIconInput;
  title: string;
  message: string;
}

const errorMap: Record<string, ErrorInfo> = {
  not_found: {
    icon: Link2Off,
    title: 'Link Not Found',
    message: "The short link you're looking for doesn't exist or may have been removed.",
  },
  expired: {
    icon: AlertTriangle,
    title: 'Link Expired',
    message: 'This short link has expired and is no longer available.',
  },
};

const defaultError: ErrorInfo = {
  icon: ShieldAlert,
  title: 'Something Went Wrong',
  message: 'An unexpected error occurred. Please try again later.',
};

@Component({
  selector: 'app-error',
  imports: [LucideDynamicIcon, RouterLink],
  templateUrl: 'error.html',
  styleUrl: 'error.scss',
})
export class ErrorComponent {
  protected readonly HomeIcon = Home;

  private route = inject(ActivatedRoute);
  private reason = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('reason'))));

  protected errorInfo = computed<ErrorInfo>(() => {
    const reason = this.reason();
    return reason && errorMap[reason] ? errorMap[reason] : defaultError;
  });
}
