import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CdkListboxModule, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Infinity,
  Link2,
  Check,
  LucideAngularModule,
  LucideIconData,
  Sparkles,
  Ticket,
  Zap,
  Copy,
} from 'lucide-angular';

interface ExpiryDurationOption {
  icon: LucideIconData;
  label: string;
  value: number;
}

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, CdkListboxModule],
  templateUrl: 'home.html',
  styleUrl: 'home.scss',
})
export class HomeComponent {
  private elementRef = inject(ElementRef);

  protected readonly SparklesIcon = Sparkles;
  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly ZapIcon = Zap;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly LinkIcon = Link2;
  protected readonly CheckIcon = Check;
  protected readonly CopyIcon = Copy;
  protected readonly InfinityIcon = Infinity;

  protected readonly expiryDurationOptions: ExpiryDurationOption[] = [
    { icon: Ticket, label: 'One time', value: 0 },
    { icon: Infinity, label: 'Never expires', value: -1 },
    { icon: Clock, label: '5 min', value: 5 * 60 * 1000 },
    { icon: Clock, label: '10 min', value: 10 * 60 * 1000 },
    { icon: Clock, label: '15 min', value: 15 * 60 * 1000 },
    { icon: Clock, label: '20 min', value: 20 * 60 * 1000 },
    { icon: Clock, label: '25 min', value: 25 * 60 * 1000 },
    { icon: Clock, label: '30 min', value: 30 * 60 * 1000 },
    { icon: Clock, label: '45 min', value: 45 * 60 * 1000 },
    { icon: Clock, label: '1 hr', value: 60 * 60 * 1000 },
    { icon: Clock, label: '2 hrs', value: 2 * 60 * 60 * 1000 },
    { icon: Clock, label: '6 hrs', value: 6 * 60 * 60 * 1000 },
    { icon: Clock, label: '12 hrs', value: 12 * 60 * 60 * 1000 },
    { icon: Clock, label: '24 hrs', value: 24 * 60 * 60 * 1000 },
  ];

  protected readonly dropdownOpen = signal(false);
  protected readonly selectedValue = signal(0);
  protected readonly selectedOption = computed(
    () =>
      this.expiryDurationOptions.find((o) => o.value === this.selectedValue()) ??
      this.expiryDurationOptions[0],
  );

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    const wrapper = this.elementRef.nativeElement.querySelector('.dropdown-wrapper');
    if (wrapper && !wrapper.contains(target)) {
      this.dropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  onOptionSelect(event: ListboxValueChangeEvent<number>) {
    this.selectedValue.set(event.value[0]);
    this.dropdownOpen.set(false);
  }
}
