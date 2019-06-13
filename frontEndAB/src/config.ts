//Config file for icons, titles, filters, and routes

export const emailFilters = [
  {displayName: 'Inbox', filter: 'inbox', materialIcon: 'inbox'},
  {displayName: 'Drafts', filter: 'drafts', materialIcon: 'drafts'},
  {displayName: 'Sent', filter: 'sent', materialIcon: 'done'}
]

export const appTitle = 'Email Client';

export const headerNavButtons = [
  {displayName: 'Contacts', routerLink:'contacts', materialIcon: 'people'},
  {displayName: 'Settings', routerLink:'settings', materialIcon: 'settings'},
]

export const appRoutes = [
  {
    path: 'email'
  },
  {
    path: 'settings'
  },
  {
    path: 'contacts'
  }
];