import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';


const routes: Routes = [
  { path: '', component: ContactsComponent },
  { path: 'edit', component: ContactEditComponent },
  { path: 'create', component: ContactCreateComponent },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
