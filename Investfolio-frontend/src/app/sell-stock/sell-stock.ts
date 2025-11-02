import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  selector: 'app-sell-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sell-stock.html',
  styleUrls: ['./sell-stock.scss'] 
})
export class SellStockComponent {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private router = inject(Router);

  sellForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.sellForm = this.fb.group({
      ticker: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.000001)]],
    });
  }

  onSubmit(): void {
    if (this.sellForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const payload = {
      ...this.sellForm.value,
      ticker: this.sellForm.value.ticker.toUpperCase()
    };

    this.portfolioService.sellStock(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Stock sold successfully! Your dashboard will be updated.';
          this.sellForm.reset();
        } else {
          this.errorMessage = res.error || 'An unknown error occurred while selling.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to process sell transaction. Do you own this stock?';
        this.isLoading = false;
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}