import { Component, NgZone, Inject, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, switchMap, takeUntil} from 'rxjs/operators';
import { EmailService, ContactService } from '../../services';
import { RecievedEmail } from '../../models';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: [ './email.component.css' ]
})
export class EmailComponent implements OnInit, OnDestroy {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  searchTerm: string;
  emailFilterType: string;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private dataService: EmailService,
    private cd: ChangeDetectorRef
  ){

  }
  selectedEmailDetail: RecievedEmail;
  protected emails_recieved: RecievedEmail[] = [];

  onEmailSelected(event){
    this.selectedEmailDetail = event;
  }

  ngOnInit(){
    this.route.queryParams.pipe(
      takeUntil(this.onDestroy$),
      map(params => {
        if(String(params['search']) != this.searchTerm || String(params['filter'] != this.emailFilterType)){
          return params;
        }
      }),
      switchMap( params => {
        // filters and parameters will be used in
        // as a future feature
        let filter = params['filter']; 
        let search = params['search'];

        return this.dataService.getRecords(this.currentUser.uid);

      })
    ).subscribe(record_data => {
      this.emails_recieved = record_data;
      this.cd.detectChanges();
    }),
    err => {
      console.log('error');
      console.log(err);
    }
  }

  openDialog(): void {
    
    let dialogRef = this.dialog.open(NewEmailDialogComponent, {
      width: '1000px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.dataService.addRecord(result).pipe(
        take(1) //implements 1st time and then unsubscribes
      ).subscribe(new_result => {
        new_result["SMTP"] = this.currentUser.STMP;
        new_result["smtp_port"] = this.currentUser.smtp_port;
        new_result["email_addr"] = this.currentUser.email_addr;
      })
    });
  }


  replyDialog(): void {
    
    let dialogRef = this.dialog.open(ReplyEmailDialogComponent, {
      width: '1000px',
      data: { 
        email: this.selectedEmailDetail
       }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.dataService.addRecord(result).pipe(
        take(1) //implements 1st time and then unsubscribes
      ).subscribe(new_result => {
        new_result["SMTP"] = this.currentUser.STMP;
        new_result["smtp_port"] = this.currentUser.smtp_port;
        new_result["email_addr"] = this.currentUser.email_addr;
      })
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}

//component needed to be at higher level for 
//matAutocomplete, matIcon, and MatChips modules to
//understand references

@Component({
  selector: 'new-email-dialog',
  templateUrl: './new-email-dialog/new-email-dialog.component.html'
})
export class NewEmailDialogComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emailCtrl = new FormControl();
  filteredEmails: Observable<string[]>;
  emails: string[] = [];
  allEmails: string[] = [];

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;


  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewEmailDialogComponent>,
    private dataService: ContactService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone
    ) {
      this.filteredEmails = this.emailCtrl.valueChanges.pipe(
        startWith(null),
        map((email: string | null) => email ? this._filter(email) : this.allEmails.slice()));
      }

  ngOnInit(){
    this.form = this.fb.group({
      recipient: ['', Validators.required],
      subject: ['', Validators.required],
      email_msg: ['', Validators.required],
      email_addr: ['', Validators.required]
    });

    this.dataService.getRecords(this.currentUser.uid).pipe(
      take(1), //implements 1st time and then unsubscribes
    ).subscribe( fetched_data => {
      var contact_email_array = [];
      for ( let email_obj of fetched_data ) {
        contact_email_array.push(email_obj.email_addr);
      }
      this.allEmails = contact_email_array;
    })

  }

  add(event: MatChipInputEvent): void {
    // Add email only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our email
      if ((value || '').trim()) {
        this.emails.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.emailCtrl.setValue(null);
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.emails.push(event.option.viewValue);
    this.emailInput.nativeElement.value = '';
    this.emailCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allEmails.filter(email => email.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit() {
    //when 'send' button pressed, form.value sent to component
    //that will package data and post it to node js
    let recipient_form_control = this.form.get('recipient');
    let email_addr_form_control = this.form.get('email_addr');
    recipient_form_control.setValue(this.emails[0]);
    email_addr_form_control.setValue(this.currentUser.email_addr);
    this.dialogRef.close(this.form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  //for textarea form control
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

}

@Component({
  selector: 'reply-email-dialog',
  templateUrl: './reply-email-dialog/reply-email-dialog.component.html'
})
export class ReplyEmailDialogComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReplyEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone
    ) { }

  ngOnInit(){
    this.form = this.fb.group({
      recipient: ['', Validators.required],
      subject: ['', Validators.required],
      email_msg: ['', Validators.required],
      email_addr: ['', Validators.required]
    });

    if (this.data) {
      this.form.get('recipient').setValue(this.data.email.from_add);
      this.form.get('subject').setValue(this.data.email.subject);
    }
  }


  onSubmit() {
    //when 'send' button pressed, form.value sent to component
    //that will package data and post it to node js
    this.dialogRef.close(this.form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  //for textarea form control
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

}