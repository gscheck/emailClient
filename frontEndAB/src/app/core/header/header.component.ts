import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { appTitle, headerNavButtons } from '../../../config';
import { Router, ActivatedRoute } from '@angular/router';
import { headerNavButton } from './header-nav-button.interface';
import { AuthenticationService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchText: string;

  headerTitle: string = appTitle; //use title indicated in src/config.ts
  navButtons: headerNavButton[] = headerNavButtons;
  @Input() sidenav: MatSidenav;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: AuthenticationService) { }

  ngOnInit() {
  }

  navigateToPage(page_name){
    this.router.navigate(['/', page_name]);
  }

  cancelSearch(){
    this.searchText = '';
  }

  logOut(){
    this.dataService.logout();
    this.router.navigate(['auth/login']);
  }

  //triggers every time new seach entered and appends
  //new search params to current url
  appendSearchParam(){
     this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {search: this.searchText},
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
    });

  }

}