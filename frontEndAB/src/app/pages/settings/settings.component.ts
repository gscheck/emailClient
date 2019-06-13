import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../services";
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.css' ]
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private dataService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'uid': [''],
      'IMAP': ['', Validators.required],
      'SMTP': ['', Validators.required],
      'imap_port': ['', Validators.required],
      'smtp_port': ['', Validators.required],
      'email_addr': ['', Validators.required],
      'pwd': [Validators.required]
    });

    this.dataService.getRecord(this.currentUser.uid).pipe(
      take(1) //implements 1st time and then unsubscribes
    ).subscribe(new_record => {
      this.form.patchValue({...new_record});
    });
    this.cd.detectChanges;
  }

  onSubmit(){

    this.dataService.updateRecord(this.form.value).pipe(
      take(1) //implements 1st time and then unsubscribes
    ).subscribe(new_record => {
      console.log('settings updated');
    });
  }

}
