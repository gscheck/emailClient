import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: '';

  constructor(
    private fb: FormBuilder,
    private dataService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
    ) { 
      this.form = this.fb.group({
      'user_name': ['', Validators.required],
      'password': ['', Validators.required]
      })
    }

  ngOnInit() {
    this.dataService.logout();
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  navigateToRegistrationForm(){
    this.router.navigate(['auth/register']);
  }

  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.dataService.login(this.form.value).pipe(
      take(1) //implements 1st time and then unsubscribes
    ).subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    )
  }

}