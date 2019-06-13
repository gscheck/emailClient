import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from "../../../services";
import { take, switchMap, takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: [ './contact-edit.component.css' ]
})
export class ContactEditComponent implements OnInit {
  form: FormGroup;
  private onDestroy$: Subject<void> = new Subject<void>();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedEmail: string;
  selectedUid: string;

  constructor(
    private dataService: ContactService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    private router: Router
    ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'uid': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email_addr': ['', Validators.required],
    });

    this.route.queryParams.pipe(
      takeUntil(this.onDestroy$),
      map(params => {
        if(String(params['search']) != this.selectedEmail || String(params['queryUid'] != this.selectedUid)){
          return params;
        }
      }),
      switchMap( params => {
        let contactEmail = params['search']; //add filters in later
        let contactUid = params['queryUid']; //add filters in later
        this.selectedEmail = contactEmail;
        this.selectedUid = contactUid;
        
        return this.dataService.getRecord(contactUid, contactEmail);
      })
    ).subscribe(record_data => {
      this.form.patchValue({...record_data});
      this.cd.detectChanges();
    }),
    err => {
      console.log('error');
      console.log(err);
    }
  }

  onSubmit(){
    this.dataService.updateRecord(this.form.value, Number(this.selectedUid), this.selectedEmail).pipe(
      take(1) //implements 1st time and then unsubscribes
    ).subscribe(new_record => {
    });
    this.router.navigate(['/contacts']);
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
