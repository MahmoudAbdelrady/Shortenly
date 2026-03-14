import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'form-error',
  imports: [KeyValuePipe],
  templateUrl: 'form-error.html',
  styleUrl: 'form-error.scss',
})
export class FormError {
  public field = input.required<AbstractControl>();
  public fieldName = input.required<string>();
  public errorMessages = input.required<Record<string, string>>({});
}
