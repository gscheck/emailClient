import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent, NewEmailDialogComponent, ReplyEmailDialogComponent} from './email.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailDetailComponent } from './email-detail/email-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule, 
        MatFormFieldModule,
        MatInputModule,
          MatListModule, 
          MatButtonModule, 
          MatIconModule,
          MatDialogModule,
          MatAutocompleteModule,
          MatChipsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EmailService } from '../../services'

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    EmailRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    FlexLayoutModule,
  ],
  declarations: [ 
    EmailComponent,
    EmailListComponent,
    EmailDetailComponent,
    NewEmailDialogComponent,
    ReplyEmailDialogComponent ],
  entryComponents: 
  [
    NewEmailDialogComponent, 
    ReplyEmailDialogComponent],
  providers: [
    EmailService
  ]
})
export class EmailModule { }