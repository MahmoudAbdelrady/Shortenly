import { Component, inject, input, output } from '@angular/core';
import {
  LucideArrowRight as ArrowRight,
  LucideDynamicIcon,
  LucideLink2 as Link2,
  LucideZap as Zap,
} from '@lucide/angular';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormError } from '../form-error/form-error';
import { CustomDropdown } from '../custom-dropdown/custom-dropdown';
import { Loading } from '../loading/loading';
import { expiryDurationOptions, ShortenFormData } from '../../shared/types/general';

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
  imports: [LucideDynamicIcon, CustomDropdown, FormError, Loading, ReactiveFormsModule],
  templateUrl: 'shorten-form.html',
  styleUrl: 'shorten-form.scss',
})
export class ShortenForm {
  private formBuilder = inject(FormBuilder);
  protected urlShortenForm = this.formBuilder.group({
    url: ['', [Validators.required, urlValidator]],
    expiryType: ['ONE_TIME', [Validators.required]],
  });

  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly ZapIcon = Zap;
  protected readonly LinkIcon = Link2;
  protected readonly expiryDurationOptions = expiryDurationOptions;

  public isLoading = input<boolean>(false);
  public shorten = output<ShortenFormData>();

  protected onExpiryTypeChange(value: string) {
    this.urlShortenForm.patchValue({ expiryType: value });
  }

  protected onSubmit() {
    this.urlShortenForm.markAllAsTouched();
    if (this.urlShortenForm.invalid) return;
    const formData: ShortenFormData = {
      url: this.urlShortenForm.value.url ?? '',
      expiryType: this.urlShortenForm.value.expiryType ?? 'ONE_TIME',
    };
    this.shorten.emit(formData);
  }
}
