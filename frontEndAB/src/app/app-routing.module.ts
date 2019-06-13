import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LayoutComponent } from './core/layout.component';
import { authRoutes } from './pages/auth/auth-routing.module';

const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './pages/home/home.module#HomeModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'email',
        loadChildren: './pages/email/email.module#EmailModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: './pages/settings/settings.module#SettingsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts',
        loadChildren: './pages/contacts/contacts.module#ContactsModule',
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'auth',
    children: [
      ...authRoutes
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabled',
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }