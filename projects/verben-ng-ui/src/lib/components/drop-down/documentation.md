SELECTOR - <verbena-drop-down></verbena-drop-down>

INPUTS
options: any[] | DropdownMenuItem[] - List containing selectable options. Can be 2-way bound to capture internal changes to the options state.

width: string- sets the width of the dropdown.
showHorizontalLine: boolean - Configures whether or not the horizontal line should show. Default is true.
horizontalLineColor: string- Configure the color of the horizontal line if shown.
optionLabel: string (Represents a valid property on the object type passed) - Can be set if options is a list of Objects and you want to configure what gets displayed for users to select and the value displayed when selected.
optionSubLabel: string (Represents a valid property on the object type passed) - Can also be set if options is a list of Objects and you want to show another property as additional information that would like to display under the label.
optionValue: string (Represents a valid property on the object type passed or in the case of a DropdownMenuItem array, a valid property on the value property if it's an object type) - Can be set if options is a list of Objects or a DropdownMenuItem array for which the value property is an object and you want to set what value formControls or ngModel bindings are mapped to.
styleClass: string - Optional class addition that would be added to the dropdown.
placeholder: string - Any value you want the dropdown to display when nothing has been selected.
invalidMessage: string - Specifies message to be shown when the dropdown is invalid. If not set, no message is shown.
errorPosition: string - Specifies the position you want the dropdown's invalid message to show relative to the dropdown. Has 3 options - 'top', 'left' and 'right'. If none of these is set, it defaults to bottom.
showClear: boolean (default = false) - Configures whether to show a clear icon to remove the current selected value or values.
lazyLoad: boolean (default = false) - Configures whether or not more items can be loaded aynchronously and added to the options list.
loadMoreCaption: string - Configures the caption of the button that is used to load more items. Only displays when lazyLoad is set to true.
group: boolean (default = false) - Configures whether the dropdown items are nested. Requires an options type of DropdownMenuItem[] as input.
multiselect: boolean (default = false)- Configures whether the dropdown allows multiple selections or not.
display: string - Only valid in multiselect contexts. Displays selected items as a chip. Default look is comma seperated.
filter: boolean (default = false) - Configures whether items in the dropdown are searchable, in a lazyload context, it calls a dedicated function 'search'. Otherwise it performs string based search.
filterBy: string - Only valid in non lazyload contexts. Specifies properties that are used for reference when searching.
debounceTime: number (default = 500) - Configures the delay allowed between user input when searching before search endpoint is called. Only valid in lazyload contexts.
minChar: number (default = 0) - Configures the minimum characters necessary before search endpoint is called. Only valid in lazyload contexts.
disabled: boolean (default = false) - Sets the disabled state of the dropdown.
required: boolean (default = false) - If set as true, display visual cues when no item is selected and the dropdown is marked as touched.
load: (context: DropdownLoadEvent) => Promise<any[]> - This is a function variable that is set to a function that accepts a DropdownLoadEvent as a parameter and returns an array. This is only valid for a lazyLoad context and is called once 'see more' or whatever loadMoreCaption set is clicked. It needs to be set for see more to work properly. What should be returned should be of the same type as the options array.
asyncLabel: (context: any) => string | null - For lazyLoad contexts where the optionValue for example is 'Id', there's a chance that the item doesn't currently exist in the options array, and you might want to display the proper label so it shows that something is selected in the dropdown. So this function variable can be set. If your dropdown is bound to a variable 'selectedItem' and you set the value to 'mock-id' we call this function sending that id to you, so you can return the proper label property to set the dropdown display state. Note though that if there's no optionValue set and you pass in an object when setting 'selectedItem', it uses the current set optionLabel to display properly and this function might not need to be set in such contexts.
search: ( data: any, context: DropdownLoadEvent) => Promise<any[]> - For lazyLoad contexts, is called when the user is searching and the debounce time has elapsed, sends to your registered function, the search param and a DropdownLoadEvent that tells you the number of pages loaded prior to the call. Once a search query is active, 'see more' being clicked still calls the search function passing in the search param and the updated DropdownLoadEvent.

OUTPUTS
optionsChange: EventEmitter<any[]> - enables options to be two-way bound.
onChange: EventEmitter<DropdownChangeEvent> - emitted when changes are made to the selected option or options.
onClick: EventEmitter<Event> - emitted when the dropdown is clicked.
onClear: EventEmitter<Event> - emitted when the selected item or items is cleared.

TEMPLATING
selected - Configure how selected items look.
item - Configure how selectable items look.
group - Configure how group header items look.

<ng-template let-item vTemplate="selected">
    {{item}} Test Selected Template
  </ng-template>
  <ng-template let-item vTemplate="item">
    {{item}} Test Item Template
  </ng-template>
  <ng-template let-item vTemplate="group">
    {{item}} Test Group Template
  </ng-template>

OBJECTS
DropdownChangeEvent - Sent when the dropdown selected option or options changes
originalEvent: Event - Event captured.
value: any - Selected option or options.

DropdownLoadEvent - Sent when the loadMore function is called
loadTimes: number of times the context has been loaded prior to the event being sent.

DropdownMenuItem - The Object type passed as an array, when group is set to true. Used for nested Dropdowns
label: string - optionLabel isn't used when group is true. Defaults to the value set here.
subLabel?: string - optionSubLabel isn't used when group is true. Defaults to the value set here if set.
value: any - Whatever is set here decides the default value on ngModel bindings and formControl bindings when optionValue isn't set. If optionValue is set, it looks on this value property for the property that matches the optionValue set.
items?: DropdownMenuItem[] - Decides whether or not this DropdownMenuItem itself would be a group. If it going to have items under it, needs to be initialized.
lazyLoad?: boolean - Configures whether or not more items under can be loaded aynchronously and added to the items list.
filterBy?: string - Only valid in non lazyload contexts and when items is not null. Specifies properties that are used for reference when searching through items list.
search?: (param: string, context: DropdownLoadEvent) => Promise<DropdownMenuItem[]> - For lazyLoad contexts, is called when the user is searching and the debounce time has elapsed, sends to your registered function, the search param and a DropdownLoadEvent that tells you the number of pages loaded prior to the call. Once a search query is active, 'see more' being clicked still calls the search function passing in the search param and the updated DropdownLoadEvent.
loadMore?: (context: DropdownLoadEvent) => Promise<DropdownMenuItem[]> - This is a function variable that is set to a function that accepts a DropdownLoadEvent as a parameter and returns an array of DropdownMenuItems. This is only valid for a lazyLoad context and is called once the item is expanded or when 'see more' or whatever loadMoreCaption set is clicked. It needs to be set for see more to work properly. What should be returned should be a DropdownMenuItem array.
