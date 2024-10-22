import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'verben-dialogue',
  templateUrl: './verben-dialogue.component.html',
  styleUrls: ['./verben-dialogue.component.css'],
})
export class VerbenDialogueComponent {
  @Input() header: string = '';
  @Input() body: string = '';
  @Input() footer: string = '';

  @Input() headerTemplate: TemplateRef<any> | null = null;
  @Input() bodyTemplate: TemplateRef<any> | null = null;
  @Input() footerTemplate: TemplateRef<any> | null = null;

  @Input() showCloseIcon: boolean = true;
  @Input() dismissOutsideClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() isVisible: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'small';
  @Input() backdropColor: string = 'rgba(0, 0, 0, 0.5)';
  @Input() customClass: string = '';
  @Input() disableFooter: boolean = false;
  @Input() margin: string = '';
  @Input() padding: string = '10px';
  @Input() borderRadius: string = '10px';
  @Input() dialogueBgColor: string = '#fff';
  @Input() closeIcon: string = 'close';
  @Input() closeIconClass: string = 'closeIconClass';
  @Input() boxShadow: string = 'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)';
  @Output() closeModal = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.closeOnEscape && this.isVisible) {
      this.onClose();
    }
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (this.dismissOutsideClick && this.isVisible) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-wrapper')) {
        this.onClose();
      }
    }
  }

  onClose() {
    this.isVisible = false;
    this.closeModal.emit();
  }
}
