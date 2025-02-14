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
  @Input() headerTemplate: TemplateRef<any> | null = null;
  @Input() bodyTemplate: TemplateRef<any> | null = null;
  @Input() footerTemplate: TemplateRef<any> | null = null;
  @Input() showCloseIcon: boolean = true;
  @Input() dismissOutsideClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() isVisible: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'small';
  @Input() backdropColor: string = '#0000005d';
  @Input() customClass: string = '';
  @Input() disableFooter: boolean = false;
  @Input() margin: string = '';
  @Input() padding: string = '10px';
  @Input() borderRadius: string = '10px';
  @Input() dialogueBgColor: string = '#fff';
  @Input() closeIconClass: string = 'closeIconClass';
  @Input() boxShadow: string = 'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)';
  @Input() enableTransition: boolean = true;
  @Input() modalData: any;

  // New inputs for drawer mode
  @Input() mode: 'dialogue' | 'drawer' = 'dialogue';
  @Input() position: 'left' | 'right' = 'right';
  @Input() drawerWidth: string = '500px';
  @Output() openModal = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();

  ngOnChanges() {
    if (this.isVisible) {
      this.openModal.emit(this.modalData);
    }
  }
  

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
      const isInsidePane = target.closest('.cdk-overlay-pane') !== null;
      if (target.classList.contains('modal-wrapper')&& !isInsidePane) {
        this.onClose();
      }
    }
  }

  onClose() {
    this.isVisible = false;
    this.closeModal.emit(this.modalData);
  }
}
