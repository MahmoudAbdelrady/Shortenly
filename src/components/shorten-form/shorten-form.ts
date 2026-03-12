import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CdkListboxModule, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Infinity,
  Link2,
  LucideAngularModule,
  LucideIconData,
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
import { toSignal } from '@angular/core/rxjs-interop';

interface ExpiryDurationOption {
  icon: LucideIconData;
  label: string;
  value: string;
}

interface ShortenFormData {
  longUrl: string;
  expiryDuration: string;
}

@Component({
  selector: 'shorten-form',
  imports: [LucideAngularModule, CdkListboxModule, FormError, ReactiveFormsModule],
  templateUrl: 'shorten-form.html',
  styleUrl: 'shorten-form.scss',
})
export class ShortenForm {
  private dropdownWrapper = viewChild<ElementRef<HTMLElement>>('dropdownWrapper');
  private formBuilder = inject(FormBuilder);
  protected urlShortenForm = this.formBuilder.group({
    longUrl: ['', [Validators.required, this.urlValidator]],
    expiryDuration: ['ONE_TIME', [Validators.required]],
  });

  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly ZapIcon = Zap;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly LinkIcon = Link2;

  protected readonly expiryDurationOptions: ExpiryDurationOption[] = [
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

  private readonly urlShortenerFormValue = toSignal(this.urlShortenForm.valueChanges, {
    initialValue: this.urlShortenForm.value,
  });
  protected readonly dropdownOpen = signal(false);
  protected readonly selectedOption = computed(
    () =>
      this.expiryDurationOptions.find(
        (o) => o.value === this.urlShortenerFormValue().expiryDuration,
      ) ?? this.expiryDurationOptions[0],
  );

  public onShorten = output<ShortenFormData>();

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    const isValid = urlRegex.test(control.value);
    return isValid ? null : { invalidUrl: true };
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null) {
    if (!this.dropdownOpen() || !(target instanceof HTMLElement)) return;
    const wrapper = this.dropdownWrapper()?.nativeElement;
    if (wrapper && !wrapper.contains(target)) {
      this.dropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  onOptionSelect(event: ListboxValueChangeEvent<string | null | undefined>) {
    const value = event.value[0];
    if (value) {
      this.urlShortenForm.patchValue({ expiryDuration: value });
    }
    this.dropdownOpen.set(false);
  }

  onSubmit() {
    this.urlShortenForm.markAllAsTouched();
    if (this.urlShortenForm.invalid) return;
    const formData: ShortenFormData = {
      longUrl: this.urlShortenForm.value.longUrl ?? '',
      expiryDuration: this.urlShortenForm.value.expiryDuration ?? 'ONE_TIME',
    };
    console.log({ formData });
    this.onShorten.emit(formData);
  }
}
