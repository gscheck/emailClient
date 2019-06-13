import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from "../../../services";
import { take } from 'rxjs/operators';
import { Router } from '@angular/router'

@Component({
  selector: 'contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: [ './contact-create.component.css' ]
})
export class ContactCreateComponent implements OnInit {
  form: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private dataService: ContactService,
    private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'uid': [''],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email_addr': ['', Validators.required],
    });

    this.form.get('uid').setValue(this.currentUser.uid);
  }

  onSubmit(){
    this.dataService.addRecord(this.form.value).pipe(
      take(1)
    ).subscribe(new_record => {
        this.form.reset();
        this.router.navigate(['/contacts']);
    });
    console.log(this.form.value);
  }

}
