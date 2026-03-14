import { Component, inject, output } from '@angular/core';
import { ArrowRight, Link2, LucideAngularModule, Zap } from 'lucide-angular';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormError } from '../form-error/form-error';
import { CustomDropdown } from '../custom-dropdown/custom-dropdown';
import { expiryDurationOptions } from '../../shared/types/general';

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
  protected readonly expiryDurationOptions = expiryDurationOptions;

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
