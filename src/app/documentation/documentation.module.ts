import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  ChipModule,
  DataViewModule,
  DatePickerModule,
  DropDownModule,
  NotificationModule,
  NumberInputModule,
  SvgModule,
  TooltipModule,
  VerbenDialogueModule,
  VerbenTimePickerModule,
  VerbenaBadgeModule,
  VerbenaButtonModule,
  VerbenaInputModule,
  VerbenaSwitchModule,
  VerbenaTabModule,
  VerbenaTextareaModule,
} from 'verben-ng-ui';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';

// Docs building blocks
import { DocsCodeBlockComponent } from './docs-kit/code-block.component';
import { DocsExampleComponent } from './docs-kit/docs-example.component';
import { DocsPageComponent } from './docs-kit/docs-page.component';
import { DocsPropsTableComponent } from './docs-kit/props-table.component';
import { DocsCodeExplorerComponent } from './docs-kit/code-explorer.component';
import { DocsChangesComponent } from './docs-kit/changes.component';
import { DocsPlaygroundShellComponent } from './docs-kit/playground-shell.component';

// Pages
import { DocsHomeComponent } from './pages/home/docs-home.component';
import { InstallationPageComponent } from './pages/installation/installation-page.component';
import { ThemingPageComponent } from './pages/theming/theming-page.component';
import { BadgePageComponent } from './pages/components/badge-page.component';
import { ButtonPageComponent } from './pages/components/button-page.component';
import { CardPageComponent } from './pages/components/card-page.component';
import { ChipPageComponent } from './pages/components/chip-page.component';
import { DatePickerPageComponent } from './pages/components/date-picker-page.component';
import { DialogPageComponent } from './pages/components/dialog-page.component';
import { DropdownPageComponent } from './pages/components/dropdown-page.component';
import { IconsPageComponent } from './pages/components/icons-page.component';
import { InputPageComponent } from './pages/components/input-page.component';
import { NotificationPageComponent } from './pages/components/notification-page.component';
import { NumberInputPageComponent } from './pages/components/number-input-page.component';
import { SwitchPageComponent } from './pages/components/switch-page.component';
import { TabsPageComponent } from './pages/components/tabs-page.component';
import { TextareaPageComponent } from './pages/components/textarea-page.component';
import { TimePickerPageComponent } from './pages/components/time-picker-page.component';
import { TooltipPageComponent } from './pages/components/tooltip-page.component';
import { VendorInvoicesComponent } from './pages/playground/vendor-invoices/vendor-invoices.component';

@NgModule({
  declarations: [
    DocumentationComponent,
    DocsCodeBlockComponent,
    DocsExampleComponent,
    DocsPageComponent,
    DocsPropsTableComponent,
    DocsCodeExplorerComponent,
    DocsChangesComponent,
    DocsPlaygroundShellComponent,
    DocsHomeComponent,
    InstallationPageComponent,
    ThemingPageComponent,
    BadgePageComponent,
    ButtonPageComponent,
    CardPageComponent,
    ChipPageComponent,
    DatePickerPageComponent,
    DialogPageComponent,
    DropdownPageComponent,
    IconsPageComponent,
    InputPageComponent,
    NotificationPageComponent,
    NumberInputPageComponent,
    SwitchPageComponent,
    TabsPageComponent,
    TextareaPageComponent,
    TimePickerPageComponent,
    TooltipPageComponent,
    VendorInvoicesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DocumentationRoutingModule,
    // Library modules used by the live examples
    CardModule,
    ChipModule,
    DatePickerModule,
    DropDownModule,
    NotificationModule,
    NumberInputModule,
    SvgModule,
    TooltipModule,
    VerbenDialogueModule,
    VerbenTimePickerModule,
    VerbenaBadgeModule,
    VerbenaButtonModule,
    VerbenaInputModule,
    VerbenaSwitchModule,
    VerbenaTabModule,
    VerbenaTextareaModule,
    DataViewModule,
  ],
})
export class DocumentationModule {}
