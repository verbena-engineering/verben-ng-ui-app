import { DropdownLoadEvent } from './DropdownLoadEvent';

// interface BaseMenuItem {
//   label: string;
//   subLabel?: string;
//   value: any;
//   lazyLoad?: false;
// }

// interface GroupMenuItem {
//   label: string;
//   subLabel?: string;
//   value: any;
//   items: DropdownMenuItem[];
//   lazyLoad: true;
//   loadMore: (context: DropdownLoadEvent) => Promise<DropdownMenuItem[]>;
//   loadTimes: DropdownLoadEvent;
// }

// var item: DropdownMenuItem = {
//   label: "",
//   value: "",
//   lazyLoad: true,
// }

// export type DropdownMenuItem = BaseMenuItem | GroupMenuItem

// type DropdownMenuItem = BaseMenuItem & (BaseMenuItem['lazyLoad'] extends true ? Required<Pick<BaseMenuItem, 'loadMore' | 'loadTimes'>>: {})

export interface DropdownMenuItem {
  label: string;
  subLabel?: string;
  value: any;
  items?: DropdownMenuItem[];
  lazyLoad?: boolean;
  filterBy?: string;
  search?: (
    param: string,
    context: DropdownLoadEvent
  ) => Promise<DropdownMenuItem[]>;
  loadMore?: (context: DropdownLoadEvent) => Promise<DropdownMenuItem[]>;
}
