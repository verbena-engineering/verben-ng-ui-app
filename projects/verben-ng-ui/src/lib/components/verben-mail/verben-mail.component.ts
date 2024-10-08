import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillConfiguration } from './verben-mail.component.config';
import { SvgModule } from '../svg/svg.module';
import { MailPayload } from '../../models/mail-model';
import { ChipModule } from '../chip/chip.module';
import { ChipChangeEvent } from '../chip/ChipChangeEvent';

@Component({
  selector: 'verbena-mail-template',
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
          if(!emailRegex.test(email)){
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
    console.log(this.mailForm.get('toEmails')?.value);
    this.bccEmails = validEmails;
  }
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  setEmailError(message: string) {
    return message;
  }

  removeEmail(type: 'to' | 'cc' | 'bcc', index: number) {
    if (type === 'to') {
      this.toEmails.splice(index, 1);
    } else if (type === 'cc') {
      this.ccEmails.splice(index, 1);
    } else {
      this.bccEmails.splice(index, 1);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploading = true;
      this.fileUploadError = null;

      setTimeout(() => {
        this.isUploading = false;
        if (file.size > 5000000) {
          this.fileUploadError = 'File size exceeds 5MB limit.';
          this.uploadedFileName = null;
        } else {
          this.uploadedFileName = file.name;
        }
      }, 2000);
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
