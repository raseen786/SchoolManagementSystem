import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public error: string;
  public loginForm: FormGroup<any>;

  private readonly loginError = 'Login failed, Please check your credentials';

  get formControls() {
    return this.loginForm.controls;
  }

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.error = '';
  }

  public onSubmit(): void {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.setToken(response.token);
          // Redirect to a different route upon success
          this.router.navigate(['/home']);
        } else {
          this.error = this.loginError;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error?.message
          ? error.error?.message
          : this.loginError;
      },
    });
  }
}
