import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewStock } from '../stock.model';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-stock-form.html',
  styleUrls: ['./add-stock-form.scss']
})
export class AddStockComponent {
  stockForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private router: Router,
    private authService: AuthService
  ) {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      ticker: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.000001)]],
      buyPrice: [null, [Validators.required, Validators.min(0)]]
    });
  }

   onSubmit(): void {
    if (this.stockForm.invalid || this.isLoading) {
      return;
    }

    const userUID = this.authService.getCurrentUserUID();
    if (!userUID) {
      this.errorMessage = 'You are not logged in. Please log in again.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    const payload = {
      ...this.stockForm.value,
      user: userUID
    };

    this.portfolioService.addStock(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
        } else {
        }
      },
        error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to add stock. Please try again.';
        this.isLoading = false;
      }
    });
  }
}