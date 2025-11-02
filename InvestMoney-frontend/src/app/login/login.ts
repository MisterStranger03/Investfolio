import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ForgotPasswordComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent { 
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // --- NEW METHOD ---
  onGoogleLogin(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.loginWithGoogle().subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage = 'Google Sign-in failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your email and password.';
        this.isLoading = false;
      }
    });
  }
}