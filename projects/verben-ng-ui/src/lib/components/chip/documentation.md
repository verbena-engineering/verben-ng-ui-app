SELECTOR - <verbena-chip></verbena-chip>

INPUTS
width: string- sets the width of the chip.
placeholder: string - Any value you want the chip to display when nothing has been added.
max: number - Allows you to set the maximum number of chips that can be added.
styleClass: string - Optional class addition that would be added to the chip.
separator: string - By Default, pressing enter triggers conversion of current text to chip. This allows you to set another input value that does similarly e.g ','.
disabled: boolean (default = false) - Sets the disabled state of the chip.
required: boolean (default = false) - If set as true, display visual cues when no chip is added and the chip is marked as touched.
invalidMessage: string - Specifies message to be shown when the dropdown is invalid. If not set, no message is shown.
errorPosition: string - Specifies the position you want the dropdown's invalid message to show relative to the dropdown. Has 3 options - 'top', 'left' and 'right'. If none of these is set, it defaults to bottom.

OUTPUTS
onChange: EventEmitter<ChipChangeEvent> - emitted when changes are made to the selected option or options.

TEMPLATING
item - Configure how chip items look.
<ng-template let-item vTemplate="item">
{{item}} Test Selected Template
</ng-template>

OBJECTS
ChipChangeEvent - Sent when the chip value changes.
originalEvent: Event - Event captured.
value: any - Selected option or options.
