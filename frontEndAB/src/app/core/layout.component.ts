import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { sideNavService } from '../services/sidenav.service';
import { onMainContentChange } from '../utils/animations/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'my-app',
  templateUrl: './layout.component.html',
  styleUrls: [ './layout.component.css' ],
  animations: [ onMainContentChange ]
})
export class LayoutComponent implements OnInit {

  public onSideNavChange: boolean;

  constructor(
    private _sideNavService: sideNavService,
    public route: ActivatedRoute,
    public router: Router,
    private cd: ChangeDetectorRef) {
    this._sideNavService.sideNavState$.subscribe( res => {
      console.log(res)
      this.onSideNavChange = res;
    })
  }

  ngOnInit(){
  }
  
}
