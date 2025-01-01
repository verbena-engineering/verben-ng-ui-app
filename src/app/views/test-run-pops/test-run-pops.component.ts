import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener,
  Output, 
  ViewChild,
  Directive,
  Renderer2,
  AfterViewInit,
  OnInit,
 } from '@angular/core';

import {
 CardData,
 CardDataViewComponent,
 ColumnDefinition,
 DataFilterType,
 DataViewComponent,
 IDataFilter,
} from 'verben-ng-ui/src/public-api';
import { columns } from './column';
import { mockData } from './helper';
import { baseStyle } from './table-style';
import { MessageEmail } from '../model/MessageEmail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-test-run-pops',
  templateUrl: './test-run-pops.component.html',
  styleUrl: './test-run-pops.component.scss'
})

export class TestRunPopsComponent implements OnInit {
  @ViewChild('vdcv') cardDataView!: CardDataViewComponent;
  @ViewChild('vdv') dataView!: DataViewComponent;
  @ViewChild('messageLog') messageLogContainer!: ElementRef;
  @Output() viewClicked = new EventEmitter<CardData>();
  @Output() emitGoBack = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}
  // visibleColumnDef: WritableSignal<ColumnDefinition<AuditTrailConfig>[]> =
  //   signal(columns);
  // visibleColumnDef = columns;
  data = mockData;
  styles = baseStyle;
  currentData: CardData | null = null;
  isGridView = true;
  selected: CardData | null = null;
  columns = columns;
  isModalVisible: boolean = false;
  dialogContent:string[] = [];
  showDropdown:boolean = false;
  openDropdownId: string | null = null;
  formData = this.newRecord();
  inputLabelColor:string ='#000000'
  inputBgColor:string ='transparent'
  form!: FormGroup;
  changetoCardView:boolean = true;
  isOpen:boolean = false;

  cardData: CardData[] = mockData.map(({User,MailHost,id}) => ({
    selected: false,
    title: MailHost,
    data: {
      id,
      MailHost,
      User,
    } as Partial<MessageEmail>,
    body: [],
    children: [],
  }));


 onClose(){ 
  this.isOpen = false
 }

  ngOnInit() {
    this.form = this.fb.group({
      MailHost: [this.formData.MailHost || '', Validators.required],
      Mail: [this.formData.Mail || '', Validators.required],
      User: [this.formData.User || '', Validators.required],
      Password: [this.formData.Password || '', Validators.required],
      InboundHost: [this.formData.InboundHost || Validators.required],
      OutboundHost: [this.formData.OutboundHost || Validators.required],
      Enabled: [this.formData.Enabled || false],
      Secured: [this.formData.Secured || false],
    });
  }

  openDetailView(mailAddress: string) {
    const cardItem = this.getCardDataByMailAddress(mailAddress);
    if (cardItem && this.cardDataView) {
      this.dataView.toggleView();
      // First reset all selections
      this.cardData.forEach((item) => {
        item.selected = false;
        if (item.children) {
          item.children.forEach((child) => (child.selected = false));
        }
      });

      // Set the selected item
      cardItem.selected = true;
      this.currentData = this.cardDataView.onItemClick(cardItem);

      // Force change detection if needed
      // this.changeDetectorRef.detectChanges();
    }
  }
  

  getCardDataByMailAddress(mailAddress: string): CardData | undefined {
    return this.cardData.find(({ data }) => data.MailAddress === mailAddress);
  }

  onViewChange(isGridView: boolean): void {
    this.isGridView = isGridView;
    // Reset selection when switching views
    if (this.currentData) {
      this.cardDataView?.clearData();
      this.currentData = null;
    }

    // console.log('SELECTED', this.selected);

    if (this.selected) {
      this.cardDataView.onItemClick(this.selected);
    }
  }

  openFormView(index: number) {
    const item = this.cardData[index];
    // console.log('ITEM = ', item);
  }

  handleExport(exportedData: Partial<any>[]) {
    console.log('Exported data:', exportedData);
    this.downloadCSV(exportedData);
  }

  goToDetails(item:CardData){ 
    this.viewClicked.emit(item)
  }

  /**
   *
   * @param data Simple csv export for testing
   */
  private downloadCSV(data: Partial<any>[]) {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => row[header]).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onSelectionChange(selectedRows:any) {
    console.log('Selection changed:', selectedRows);
    // Handle the selection change
  }

  /**
   * Copied over from card view doc until I understand usage
   */
  selectedColumnCount: number = 0;
  selectedFilterTableCount: number = 0;
  isOPen: boolean = true;
  selectedSortCount: number = 0;
  showColumn: boolean = false;
  showSort: boolean = false;
  selectedAll: boolean = false;

  visibleColumns: IDataFilter[] = columns.map((col) => ({
    checked: true,
    name: typeof col.header === 'string' ? col.header : col.id,
    type: DataFilterType.Bool,
  }));

  filterArray: IDataFilter[] = [
    {
      name: 'Entity',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'Operation',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'CreatedAt',
      type: DataFilterType.Date,
      checked: false,
    },
  ];

  sortOptions: IDataFilter[] = [
    {
      name: 'Entity',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'Operation',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'CreatedAt',
      type: DataFilterType.Date,
      checked: false,
    },
  ];

  clearData() {
    this.currentData = {} as CardData;
  }

  loadMore() {
    this.cardData = this.cardData.concat(this.cardData);
  }

  onColumnChange(event: boolean) {
    this.showColumn = event;
  }

  onSortChange(event: boolean) {
    this.showSort = event;
    console.log(event);
  }

  onColumnsUpdated(updatedColumns: IDataFilter[]) {
    const updatedColumnDef: ColumnDefinition<MessageEmail>[] = [];
    updatedColumns.forEach((col) => {
      const matchingCol = columns.find(
        (column) => column.header === col.name || column.id === col.name
      );
      if (matchingCol) {
        updatedColumnDef.push(matchingCol);
      }
    });

    this.columns = [...updatedColumnDef];
  }

  onSortUpdated(updatedSorts: IDataFilter[]) {
    this.onSortChange(false);
    this.selectedSortCount = updatedSorts.length;
    console.log(updatedSorts);
  }

  onStateChange(event: { key: string; value: boolean }): void {
    console.log(`State changed for ${event.key}:`, event.value);
  }

  onRowEdit(editedRow: any) {
    console.log('Row edited:', editedRow);
    // Handle the edited row
  }
  addEllipses(text: any): string {
    if (text.length > 7) {
      return text.substring(0, 7) + '...';
    }
    return text;
  }
  hashPwd(txt: string): string {
    return '*'.repeat(txt.length);
  }

  seeMore(data: string[]) {
    this.isModalVisible = true;
    this.dialogContent = data
   
  }
  onModalClose(event: any) {
    this.isModalVisible = false;
  }

  openDropdown(item: any): void {
    console.log('item is here',item)
    if (this.openDropdownId === item.id) {
      this.openDropdownId = null;
    } else {
      this.openDropdownId = item.id;
    }
  }

  isDropdownOpen(item: any): boolean {
    return this.openDropdownId === item.id;
  }

  // onMouseOut(event: MouseEvent, item: any): void {
  //   const targetElement = event.relatedTarget as HTMLElement;
  
  //   if (!targetElement || !targetElement.closest('.dropdown-container')) {
  //     this.openDropdownId = null;
  //   }
  // }

  goBack(){ 
    this.emitGoBack.emit()
  }

  goToCardView(){ 
      this.changetoCardView = false;
  }

  newRecord(){ 
    return{ 
      MailHost:'',
      InboundHost:'',
      OutboundHost:'',
      Mail:'',
      User:'',
      Password:'',
      Enabled:false,
      Secured:false,
    }
  }
}
