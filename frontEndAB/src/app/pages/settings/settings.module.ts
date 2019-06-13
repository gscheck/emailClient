import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule, MatCardModule, MatButtonModule } from '@angular/material';
import { UserService } from '../../services';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  declarations: [ SettingsComponent ],
  providers: [ UserService ]
})
export class SettingsModule { }