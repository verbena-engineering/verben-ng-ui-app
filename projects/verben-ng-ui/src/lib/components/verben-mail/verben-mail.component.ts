import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillConfiguration } from 'verben-ng-ui/src/config/quill-config';
import { SvgModule } from '../svg/svg.module';
import { MailPayload } from '../../models/mail-model';
import { ChipModule } from '../chip/chip.module';

@Component({
  selector: 'verben-mail-template',
  templateUrl: './verben-mail.component.html',
  styleUrls: ['./verben-mail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    ReactiveFormsModule,
    ChipModule,
    SvgModule,
  ],
})
export class VerbenMailTemplate {
  @Input() containerWidth: string = '500px';
  @Input() borderRadius: string = '10px';
  @Input() primaryColor: string = '#FFE681';
  @Input() secondaryColor: string = '';
  @Input() tetiaryColor: string = '';
  @Input() border: string = '1px solid gray';
  @Input() pd: string = '20px';
  @Input() m: string = '';
  @Input() max: number =10;
  mailForm: FormGroup;
  isRichText: boolean = false;
  quillConfig = QuillConfiguration;
  isUploading: boolean = false;
  uploadedFileName: string | null = null;
  fileUploadError: string | null = null;
  toEmails: string[] = [];
  ccEmails: string[] = [];
  bccEmails: string[] = [];
  toEmailInput: string = '';
  ccEmailInput: string = '';
  bccEmailInput: string = '';

  toEmailError: string | null = null;
  ccEmailError: string | null = null;
  bccEmailError: string | null = null;
  @Output() mailPayload = new EventEmitter<MailPayload>();
  constructor(private fb: FormBuilder) {
    this.mailForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      toEmails: [[], Validators.required],
      ccEmails: [[]],
      bccEmails: [[]],
    });
  }

  onToChange(): void {
    const newValues = this.mailForm.get('toEmails')?.value || [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails: string[] = [];

    newValues.forEach((email: string) => {
      if (emailRegex.test(email)) {
        validEmails.push(email);
      } else {
        if (!emailRegex.test(email)) {
          this.toEmailError = 'email must be valid';
        }
      }
    });
    if (validEmails.length === 0) {
      this.toEmailError = 'Please provide at least one valid email';
    } else {
      this.toEmailError = '';
    }

    this.toEmails = validEmails;
  }

  onCcChange(): void {
    const newValues = this.mailForm.get('ccEmails')?.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = newValues.filter((email: string) =>
      emailRegex.test(email)
    );
    this.ccEmails = validEmails;
  }
  onBccChange(): void {
    const newValues = this.mailForm.get('bccEmails')?.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = newValues.filter((email: string) =>
      emailRegex.test(email)
    );
    this.bccEmails = validEmails;
  }
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

 
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileUploadError = null;
      if (!file) {
        this.isUploading = true;
      }
      if (file.size > 5000000) {
        this.fileUploadError = 'File size exceeds 5MB limit.';
        this.uploadedFileName = null;
        this.isUploading = false; // Reset isUploading state
      } else {
        this.uploadedFileName = file.name;
      }
    } else {
      this.isUploading = false; 
    }
  }

  removeFile() {
    this.uploadedFileName = null;
    this.fileUploadError = null;
    const fileInput = document.getElementById('attachment') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  toggleEditor() {
    this.isRichText = !this.isRichText;
    if (!this.isRichText) {
      const body = this.mailForm.value.body;
      this.mailForm.get('body')?.setValue(this.stripHtml(body));
    }
  }

  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  sendEmail() {
    if (this.mailForm.valid) {
      const emailData: MailPayload = {
        subject: this.mailForm.value.subject,
        body: this.mailForm.value.body,
        to: this.mailForm.get('toEmails')?.value,
        cc: this.mailForm.get('ccEmails')?.value,
        bcc: this.mailForm.get('bccEmails')?.value,
        attachment: this.uploadedFileName,
      };
      this.mailPayload.emit(emailData);
    }
  }
}
