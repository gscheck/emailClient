import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { sideNavService } from './services/sidenav.service';
import { EmailModule } from './pages/email/email.module';
import { ContactsModule } from './pages/contacts/contacts.module';
import { SettingsModule } from './pages/settings/settings.module';

import { AppRoutingModule } from './app-routing.module';

import { PagesModule } from './pages/pages.module';
import { LayoutModule } from './core/layout.module';

import { AuthGuard } from './guard/auth.guard';
import { UserService, AuthenticationService } from './services';


@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule, 
    MaterialModule, 
    BrowserAnimationsModule, 
    FlexLayoutModule,
    ReactiveFormsModule,
    //Pages Module,
    AppRoutingModule,
    EmailModule,
    ContactsModule,
    SettingsModule,
    PagesModule,
    LayoutModule
    
  ],
  declarations: [ 
    AppComponent,
    //LayoutComponent,
    //HeaderComponent,
    //LeftSideNavComponent

  ],
  bootstrap:    [ AppComponent ],
  providers: [ 
    sideNavService,
    AuthGuard, 
    UserService, 
    AuthenticationService  ]
})
export class AppModule { }
