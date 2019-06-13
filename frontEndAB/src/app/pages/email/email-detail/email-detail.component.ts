import { Component, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { RecievedEmail } from '../../../models';
import { EmailService } from '../../../services';
import { take } from 'rxjs/operators';
@Component({
  selector: 'email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: [ './email-detail.component.css' ]
})

export class EmailDetailComponent implements OnChanges{
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  email_html_body: string;
  @Input() email: RecievedEmail;

  constructor( 
    private dataService: EmailService,
    private cd: ChangeDetectorRef
    ) { }


  ngOnChanges(){
    if(this.email){
      this.dataService.getRecord(this.currentUser.uid,Number(this.email.msg_id)).pipe(
        take(1) //implements 1st time and then unsubscribes
      ).subscribe(fetched_email_html => {
        this.email_html_body = fetched_email_html;
        this.cd.detectChanges();
      })
    }
  }



}