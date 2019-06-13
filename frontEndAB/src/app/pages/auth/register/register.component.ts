import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: '';

  constructor(
    private fb: FormBuilder,
    private dataService: UserService,
    private router: Router,
    private route: ActivatedRoute
    ) { 
    }

  ngOnInit() {
   this.form = this.fb.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'phone': ['', Validators.required],
      'password': ['', Validators.required],
      'user_name': ['', Validators.required],

      'email_addr': ['', Validators.required],
      'SMTP': ['', Validators.required],
      'IMAP': ['', Validators.required],
      'pwd': ['', Validators.required],
      'imap_port': ['', Validators.required],
      'smtp_port': ['', Validators.required]
      })
  }
  
  navigateToLoginForm(){
    this.router.navigate(['auth/login']);
  }

  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.dataService.addRecord(this.form.value)
      .pipe(take(1) //implements 1st time and then unsubscribes
    ).subscribe(
      data => {
        this.router.navigate(['/login']);
      },
      error => {
        this.loading = false;
    });
  }
}