import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsComponent } from './contacts.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContactsRoutingModule } from './contacts-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { ContactListComponent } from './contact-list/contact-list.component';
//import { SvgIconComponent } from '../../utils/svg-icon/svg-icon.component';
import { ContactService } from '../../services';
@NgModule({
  imports: [
    CommonModule,
    ContactsRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [ 
    ContactsComponent,
    ContactCreateComponent,
    ContactEditComponent,
    ContactListComponent],
  providers: [ContactService]
})
export class ContactsModule { }