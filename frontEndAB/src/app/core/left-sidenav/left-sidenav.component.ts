import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { emailFilter } from './email-filter.interface';
import { sideNavService } from '../../services/sidenav.service';
import { onSideNavChange } from '../../utils/animations/animations';
import { emailFilters, appRoutes } from '../../../config';

@Component({
  selector: 'app-left-sidenav',
  templateUrl: './left-sidenav.component.html',
  styleUrls: [ './left-sidenav.component.css' ],
  animations: [onSideNavChange]
})
export class LeftSideNavComponent  {
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  private emailAppRoute = appRoutes[0].path;

  private EmailFilters: emailFilter[] = emailFilters;

  constructor(
    private _sideNavService: sideNavService,
    private router: Router) { }

  ngOnInit() {
  }

  navigateToPage(emailFilter){
    this.router.navigate(['/', this.emailAppRoute], { queryParams: {filter: emailFilter}});
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState
    
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sideNavService.sideNavState$.next(this.sideNavState)
  }


}
