import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillConfiguration } from './verben-mail.component.config';
import { SvgModule } from '../svg/svg.module';
import { MailPayload } from '../../models/mail-model';
import { ChipModule } from '../chip/chip.module';

@Component({
  selector: 'verbena-mail-template',
  templateUrl: './verben-mail.component.html',
  styleUrls: ['./verben-mail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, ReactiveFormsModule,ChipModule,SvgModule],
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
      toEmailInput: [''],
      ccEmailInput: [''],
      bccEmailInput: [''],
    });
  }

  addEmail(type: 'to' | 'cc' | 'bcc') {
    let emailInput = '';

    if (type === 'to') {
      emailInput = this.mailForm.value.toEmailInput;
    } else if (type === 'cc') {
      emailInput = this.mailForm.value.ccEmailInput;
    } else if (type === 'bcc') {
      emailInput = this.mailForm.value.bccEmailInput;
    }

    if (!emailInput) {
      this.setEmailError(type, 'Email cannot be empty.');
      return;
    }

    if (this.validateEmail(emailInput)) {
      if (type === 'to') {
        this.toEmails.push(emailInput);
        this.mailForm.get('toEmails')?.setValue(this.toEmails)
        this.mailForm.get('toEmailInput')?.setValue('');
        this.toEmailError = null;
      } else if (type === 'cc') {
        this.ccEmails.push(emailInput);
        this.mailForm.get('ccEmails')?.setValue(this.ccEmails);
        this.mailForm.get('ccEmailInput')?.setValue('');
        this.ccEmailError = null;
      } else if (type === 'bcc') {
        this.bccEmails.push(emailInput);
        this.mailForm.get('bccEmails')?.setValue(this.bccEmails);
        this.mailForm.get('bccEmailInput')?.setValue('');
        this.bccEmailError = null;
      }
    } else {
      this.setEmailError(type, 'Invalid email format.');
    }

    console.log(emailInput, "jj");
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  setEmailError(type: 'to' | 'cc' | 'bcc', message: string) {
    if (type === 'to') {
      this.toEmailError = message;
    } else if (type === 'cc') {
      this.ccEmailError = message;
    } else {
      this.bccEmailError = message;
    }
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
      const emailData:MailPayload = {
        subject: this.mailForm.value.subject,
        body: this.mailForm.value.body,
        to:this.toEmails,
        cc:this.ccEmails,
        bcc:this.bccEmails,
        attachment: this.uploadedFileName,
      };
      this.mailPayload.emit(emailData);
    }
  }
}


