import {
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CdkListboxModule, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
  LucideChevronDown as ChevronDown,
  LucideDynamicIcon,
  LucideIconInput,
} from '@lucide/angular';
import { DropdownOption } from '../../shared/types/general';

@Component({
  selector: 'custom-dropdown',
  imports: [LucideDynamicIcon, CdkListboxModule],
  templateUrl: './custom-dropdown.html',
  styleUrl: './custom-dropdown.scss',
})
export class CustomDropdown {
  private dropdownWrapper = viewChild<ElementRef<HTMLElement>>('dropdownWrapper');

  public items = input.required<DropdownOption[]>();
  public fieldValue = input.required<string>();
  public fieldValueDefaultIcon = input<LucideIconInput>();
  public valueChange = output<string>();

  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly dropdownOpen = signal(false);
  protected readonly selectedOption = computed(
    () => this.items().find((o) => o.value === this.fieldValue()) ?? this.items()[0],
  );

  @HostListener('document:click', ['$event.target'])
  protected onClickOutside(target: EventTarget | null) {
    if (!this.dropdownOpen() || !(target instanceof HTMLElement)) return;
    const wrapper = this.dropdownWrapper()?.nativeElement;
    if (wrapper && !wrapper.contains(target)) {
      this.dropdownOpen.set(false);
    }
  }

  protected toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  protected onOptionSelect(event: ListboxValueChangeEvent<string>) {
    const value = event.value[0];
    if (value) {
      this.valueChange.emit(value);
    }
    this.dropdownOpen.set(false);
  }
}
