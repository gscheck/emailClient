import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger } from '@angular/animations';
import { Contact } from '../../../models';
import { delay, map, tap, take, switchMap } from 'rxjs/operators';
import { fadeIn, fadeOut } from '../../../utils/animations/animations';
import { ContactService } from '../../../services'
const RESPONSE_DELAY = 1750;

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.component.html', 
  animations: [
    trigger('fadeOut', fadeOut()),
    trigger('fadeIn', fadeIn(':enter')) 
  ],
  styleUrls: [
    'contact-list.component.scss'
  ],
})
export class ContactListComponent implements OnInit{
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  contacts: Contact[];

  constructor(
    private dataService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
  }

  editRecord(record: Contact){
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      queryParams: {search: record.email_addr, queryUid: record.uid},
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
    });
  }

  deleteRecord(record: Contact){
    this.dataService.deleteRecord(record.uid, record.email_addr).pipe(
      take(1), //implements 1st time and then unsubscribes
      switchMap( data => {
        return this.dataService.getRecords(this.currentUser.uid);
      })
    ).subscribe( fetched_data => {
    this.contacts = fetched_data;
    })
  }

  createRecord(){
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

  ngOnInit(){
    this.dataService.getRecords(this.currentUser.uid).pipe(
      take(1), //implements 1st time and then unsubscribes
      delay(RESPONSE_DELAY)
    ).subscribe( fetched_data => {
      this.contacts = fetched_data;
    })
  }
}
