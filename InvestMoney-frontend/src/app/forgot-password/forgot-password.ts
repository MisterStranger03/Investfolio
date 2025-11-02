import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService) {}

  async onSubmit() {
    this.message = this.error = '';
    this.loading = true;

    try {
      await this.authService.resetPassword(this.email).toPromise();
      this.message = 'Password reset link has been sent to your email.';
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        this.error = 'No account found with this email.';
      } else if (err.code === 'auth/invalid-email') {
        this.error = 'Please enter a valid email address.';
      } else {
        this.error = err.message;
      }
    } finally {
      this.loading = false;
    }
  }
}