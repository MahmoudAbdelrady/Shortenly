import { Component, inject, output } from '@angular/core';
import {
  ArrowRight,
  Clock,
  Infinity,
  Link2,
  LucideAngularModule,
  Ticket,
  Zap,
} from 'lucide-angular';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormError } from '../form-error/form-error';
import { CustomDropdown } from '../custom-dropdown/custom-dropdown';
import { DropdownOption } from '../../shared/types/general';

interface ShortenFormData {
  longUrl: string;
  expiryDuration: string;
}

function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  try {
    new URL(control.value);
    return null;
  } catch {
    return { invalidUrl: true };
  }
}

@Component({
  selector: 'shorten-form',
  imports: [LucideAngularModule, CustomDropdown, FormError, ReactiveFormsModule],
  templateUrl: 'shorten-form.html',
  styleUrl: 'shorten-form.scss',
})
export class ShortenForm {
  private formBuilder = inject(FormBuilder);
  protected urlShortenForm = this.formBuilder.group({
    longUrl: ['', [Validators.required, urlValidator]],
    expiryDuration: ['ONE_TIME', [Validators.required]],
  });

  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly ZapIcon = Zap;
  protected readonly LinkIcon = Link2;

  protected readonly expiryDurationOptions: DropdownOption[] = [
    { icon: Ticket, label: 'One time', value: 'ONE_TIME' },
    { icon: Infinity, label: 'Never expires', value: 'NEVER_EXPIRES' },
    { icon: Clock, label: '5 min', value: '5_MIN' },
    { icon: Clock, label: '10 min', value: '10_MIN' },
    { icon: Clock, label: '15 min', value: '15_MIN' },
    { icon: Clock, label: '20 min', value: '20_MIN' },
    { icon: Clock, label: '25 min', value: '25_MIN' },
    { icon: Clock, label: '30 min', value: '30_MIN' },
    { icon: Clock, label: '45 min', value: '45_MIN' },
    { icon: Clock, label: '1 hr', value: '1_HR' },
    { icon: Clock, label: '2 hrs', value: '2_HR' },
    { icon: Clock, label: '6 hrs', value: '6_HR' },
    { icon: Clock, label: '12 hrs', value: '12_HR' },
    { icon: Clock, label: '24 hrs', value: '24_HR' },
  ];

  public shorten = output<ShortenFormData>();

  protected onExpiryDurationChange(value: string) {
    this.urlShortenForm.patchValue({ expiryDuration: value });
  }

  protected onSubmit() {
    this.urlShortenForm.markAllAsTouched();
    if (this.urlShortenForm.invalid) return;
    const formData: ShortenFormData = {
      longUrl: this.urlShortenForm.value.longUrl ?? '',
      expiryDuration: this.urlShortenForm.value.expiryDuration ?? 'ONE_TIME',
    };
    this.shorten.emit(formData);
  }
}
