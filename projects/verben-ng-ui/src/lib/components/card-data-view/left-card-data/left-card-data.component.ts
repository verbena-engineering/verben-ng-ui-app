import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CardData } from '../card-data';
import { CardDataViewComponent } from '../card-data-view.component';
import {
  CardHoverAction,
  CardHoverActionsPosition,
} from '../card-hover-actions/card-hover-actions.component';

@Component({
  selector: 'verben-left-card-data',
  templateUrl: './left-card-data.component.html',
  styleUrl: './left-card-data.component.css',
})
export class LeftCardDataComponent {
  @Input() pd = '10px';
  @Input() mg = '0px';
  @Input() height?: string = '100%';
  @Input() weight?: string = '100%';
  @Input() activeCss?: string;
  @Input() inActiveCss?: string;
  @Input() cardDataList: CardData[] = [];
  @Input() iconCollapse: string = 'plus';
  @Input() iconExpanded: string = 'minus';
  @Input() parent!: CardDataViewComponent;
  @Input() useVirtualScroll: boolean = false;
  @Input() virtualScrollItemSize: number = 5;
  @ContentChild('card') card!: TemplateRef<any>;
  @ContentChild('cardChild') cardChild!: TemplateRef<any>;
  @ContentChild('cardFooter') cardFooter!: TemplateRef<any>;
  @Input() dataId!: string; //what to use to identify each data
  /**
   * Buttons revealed on hover / keyboard focus over each card (the #card
   * template) and, unless cardChildActions says otherwise, each child card
   * (#cardChild). When set, every card is wrapped in <verben-card-hover-actions>
   * with its own CardData; empty or unset renders exactly as before (no wrapper).
   * Pass a stable array (a field, not an inline literal).
   */
  @Input() cardActions: CardHoverAction[] | null | undefined = [];
  /**
   * Different buttons for child cards (#cardChild). Unset (undefined): the
   * children use cardActions. [] or null: no buttons on children.
   * canView / onSelect receive the child's CardData.
   */
  @Input() cardChildActions: CardHoverAction[] | null | undefined = undefined;
  /** Where those buttons sit on each card (and child card). */
  @Input() cardActionsPosition: CardHoverActionsPosition = 'top-right';

  /** The actions for child cards: cardChildActions when set, else cardActions */
  get childActions(): CardHoverAction[] | null | undefined {
    return this.cardChildActions === undefined ? this.cardActions : this.cardChildActions;
  }
  // currentItem:any={};
  showToggle(item: CardData) {
    // showToggle() && item.children.length>0
    return (
      this.cardDataList.filter((_) => _.selected).length > 0 &&
      item.children.length > 0
    );
  }
  showChildren(item: CardData) {
    var currToggleState = item.isChildrenExpanded;
    this.cardDataList.forEach((_) => {
      _.isChildrenExpanded = false;
      _.selected = false;
    });
    this.parent.onItemClick(item);
    item.isChildrenExpanded = !currToggleState;
  }
}
