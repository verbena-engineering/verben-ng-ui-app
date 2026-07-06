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
  @Input() dialogueWidth: string = '';
  @Input() headerTemplate: TemplateRef<any> | null = null;
  @Input() bodyTemplate: TemplateRef<any> | null = null;
  @Input() footerTemplate: TemplateRef<any> | null = null;
  @Input() showCloseIcon: boolean = true;
  @Input() dismissOutsideClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() isVisible: boolean = false;
  @Input() size: 'small' | 'medium' | 'large'|'any' = 'small';
  @Input() backdropColor: string = 'var(--vbn-color-scrim)';
  @Input() customClass: string = '';
  @Input() disableFooter: boolean = false;
  @Input() margin: string = '';
  @Input() padding: string = '10px';
  @Input() borderRadius: string = '10px';
  @Input() dialogueBgColor: string = 'var(--vbn-color-surface)';
  @Input() width: string = 'max-w-[100px]';
  @Input() closeIconClass: string = 'closeIconClass';
  @Input() boxShadow: string = 'var(--vbn-shadow-md)';
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
  setStyles() {
    const isDialogue = this.mode === 'dialogue';
    const noCustomWidth = !this.dialogueWidth;
  
    return {
      'modal-content p-4': isDialogue,
      'max-w-sm': isDialogue && this.size === 'small' && noCustomWidth,
      'max-w-md': isDialogue && this.size === 'medium' && noCustomWidth,
      'max-w-lg': isDialogue && this.size === 'large' && noCustomWidth,
      'drawer-left': this.mode === 'drawer' && this.position === 'left',
      'drawer-right': this.mode === 'drawer' && this.position === 'right',
      'drawer-show-left': this.mode === 'drawer' && this.position === 'left' && this.isVisible,
      'drawer-show-right': this.mode === 'drawer' && this.position === 'right' && this.isVisible
    };
  }
  
  
  onClose() {
    this.isVisible = false;
    this.closeModal.emit(this.modalData);
  }
}
