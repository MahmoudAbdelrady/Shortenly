import { Component, inject } from '@angular/core';
import {
  LucideCircleAlert as CircleAlert,
  LucideCircleCheck as CircleCheck,
  LucideDynamicIcon,
  LucideX as X,
} from '@lucide/angular';
import { ToastService } from '../../service/toast';

@Component({
  selector: 'toast-container',
  imports: [LucideDynamicIcon],
  templateUrl: 'toast.html',
  styleUrl: 'toast.scss',
})
export class ToastContainer {
  protected readonly CircleAlertIcon = CircleAlert;
  protected readonly CircleCheckIcon = CircleCheck;
  protected readonly XIcon = X;
  protected readonly toastService = inject(ToastService);
}
