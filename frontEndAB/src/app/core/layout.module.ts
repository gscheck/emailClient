import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; //provides <router-outlet \>
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { sideNavService } from '../services/sidenav.service';
import { LeftSideNavComponent } from './left-sidenav/left-sidenav.component';
import { HeaderComponent } from './/header/header.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { LayoutComponent } from './layout.component';


@NgModule({
  imports:      [ 
    BrowserModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule, 
    FlexLayoutModule
    
  ],
  declarations: [
    HeaderComponent, 
    LeftSideNavComponent,
    LayoutComponent
  ],
  providers: [ sideNavService ]
})
export class LayoutModule { }
