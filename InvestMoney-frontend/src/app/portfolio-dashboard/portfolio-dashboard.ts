import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of, Observable, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

import { PortfolioService, ApiResponse } from '../services/portfolio.service';
import { ProfileService, Profile } from '../services/profile';
import { Stock, EnhancedStock } from '../stock.model';

interface ProfileApiResponse { success: boolean; data: Profile | null; }
interface StocksApiResponse { success: boolean; data: Stock[]; }
interface PriceApiResponse { success: boolean; data: { price: number; previousClose: number; }; }

@Component({
  selector: 'app-portfolio-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, PercentPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './portfolio-dashboard.html',
  styleUrls: ['./portfolio-dashboard.scss']
})
export class PortfolioDashboardComponent implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioService);
  private profileService = inject(ProfileService);

  public rawPortfolio: Stock[] = []; 
  public isMobileView = window.innerWidth <= 900;
  public filteredAndSortedPortfolio: EnhancedStock[] = [];
  public searchControl = new FormControl('');
  private searchSub!: Subscription;
  
  public currentSort: keyof EnhancedStock | 'name' = 'currentValue';
  public sortDirection: 'asc' | 'desc' = 'desc';

  isLoading = true;
  userCurrency = 'INR';

  totalInvested = 0;
  totalCurrentValue = 0;
  totalGainLoss = 0;
  overallGainPercent = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileView = window.innerWidth <= 900;
  }

  ngOnInit(): void {
    this.loadData();
    this.listenForFilterChanges();
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
  
  private groupAndEnhanceStocks(priceDataMap: Map<string, any>): EnhancedStock[] {
    const grouped = new Map<string, { totalInvested: number; totalQuantity: number; name: string; purchases: Stock[]; }>();

    for (const stock of this.rawPortfolio) {
      const existing = grouped.get(stock.ticker);
      if (existing) {
        existing.totalInvested += stock.buyPrice * stock.quantity;
        existing.totalQuantity += stock.quantity;
        existing.purchases.push(stock);
      } else {
        grouped.set(stock.ticker, {
          name: stock.name,
          totalInvested: stock.buyPrice * stock.quantity,
          totalQuantity: stock.quantity,
          purchases: [stock]
        });
      }
    }

    return Array.from(grouped.entries()).map(([ticker, group]) => {
      const priceData = priceDataMap.get(ticker);
      const currentPrice = priceData?.price;
      const previousClose = priceData?.previousClose;

      const avgBuyPrice = group.totalInvested / group.totalQuantity;
      const currentValue = currentPrice ? group.totalQuantity * currentPrice : null;
      const gainLoss = currentValue !== null ? currentValue - group.totalInvested : null;
      const gainLossPercent = gainLoss !== null && group.totalInvested !== 0 ? gainLoss / group.totalInvested : null;
      
      const dayChange = currentPrice && previousClose ? currentPrice - previousClose : null;
      const dayChangePercent = dayChange && previousClose && previousClose !== 0 ? dayChange / previousClose : null;

      return {
        _id: ticker, 
        name: group.name,
        ticker,
        quantity: group.totalQuantity,
        buyPrice: avgBuyPrice,
        purchaseDate: group.purchases.sort((a,b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())[0].purchaseDate,
        user: this.rawPortfolio[0]?.user || '',
        currentPrice,
        investedAmount: group.totalInvested,
        currentValue,
        gainLoss,
        gainLossPercent,
        dayChange,
        dayChangePercent,
        individualPurchases: group.purchases.sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()),
        isExpanded: false
      };
    });
  }

  toggleRow(stock: EnhancedStock): void {
    stock.isExpanded = !stock.isExpanded;
  }
  
  setSort(property: keyof EnhancedStock | 'name'): void {
    if (this.currentSort === property) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = property;
      this.sortDirection = 'desc';
    }
    this.filterAndSortPortfolio(this.searchControl.value || '');
  }

  private filterAndSortPortfolio(searchTerm: string): void {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    let processedPortfolio = this.rawPortfolio.length > 0
      ? this.groupAndEnhanceStocks(new Map(this.filteredAndSortedPortfolio.map(s => [s.ticker, { price: s.currentPrice, previousClose: s.currentPrice! - (s.dayChange || 0) }])))
          .filter(stock => 
            stock.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            stock.ticker.toLowerCase().includes(lowerCaseSearchTerm)
          )
      : [];

    if (this.currentSort) {
      processedPortfolio.sort((a, b) => {
        const valA = a[this.currentSort!] ?? -Infinity;
        const valB = b[this.currentSort!] ?? -Infinity;
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB);
        }
        
        const result = (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
        return this.sortDirection === 'asc' ? result : -result;
      });
    }
    
    this.filteredAndSortedPortfolio = processedPortfolio;
    this.calculateTotals();
  }

  private listenForFilterChanges(): void {
    this.searchSub = this.searchControl.valueChanges.pipe(startWith('')).subscribe(searchTerm => {
      this.filterAndSortPortfolio(searchTerm || '');
    });
  }

  loadData(): void {
    this.isLoading = true;
    (this.profileService.getProfile() as Observable<ProfileApiResponse>).pipe(
      tap(profileRes => {
        if (profileRes.success && profileRes.data?.defaultCurrency) {
          this.userCurrency = profileRes.data.defaultCurrency;
        }
      }),
      switchMap(() => this.portfolioService.getStocks() as Observable<StocksApiResponse>),
      switchMap((stocksRes: StocksApiResponse) => {
        if (!stocksRes.success || !Array.isArray(stocksRes.data) || stocksRes.data.length === 0) {
          this.rawPortfolio = [];
          return of(new Map());
        }
        this.rawPortfolio = stocksRes.data;
        const uniqueTickers = [...new Set(this.rawPortfolio.map(s => s.ticker))];
        
        const priceRequests = uniqueTickers.map(ticker =>
          (this.portfolioService.getCurrentPrice(ticker) as Observable<PriceApiResponse>).pipe(
            map(priceRes => ({ ticker, data: priceRes.success ? priceRes.data : null })),
            catchError(() => of({ ticker, data: null }))
          )
        );
        return forkJoin(priceRequests).pipe(
          map(results => new Map(results.map(r => [r.ticker, r.data])))
        );
      })
    ).subscribe({
      next: (priceDataMap: Map<string, any>) => {
        this.filteredAndSortedPortfolio = this.groupAndEnhanceStocks(priceDataMap);
        this.filterAndSortPortfolio(this.searchControl.value || ''); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load portfolio data:", err);
        this.isLoading = false;
        this.rawPortfolio = [];
        this.filteredAndSortedPortfolio = [];
        this.calculateTotals();
      }
    });
  }

  calculateTotals(): void {
    if (this.filteredAndSortedPortfolio.length === 0) {
      this.totalInvested = 0;
      this.totalCurrentValue = 0;
      this.totalGainLoss = 0;
      this.overallGainPercent = 0;
      return;
    }
    this.totalInvested = this.filteredAndSortedPortfolio.reduce((acc, stock) => acc + stock.investedAmount, 0);
    this.totalCurrentValue = this.filteredAndSortedPortfolio.reduce((acc, stock) => acc + (stock.currentValue || stock.investedAmount), 0);
    this.totalGainLoss = this.totalCurrentValue - this.totalInvested;
    this.overallGainPercent = this.totalInvested !== 0 ? this.totalGainLoss / this.totalInvested : 0;
  }

  deleteIndividualStock(id: string): void {
    if (confirm('Are you sure you want to delete this specific purchase record?')) {
      this.portfolioService.deleteStock(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadData(); 
          } else {
            alert('Failed to delete stock. Please try again.');
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('An error occurred while deleting the stock.');
        }
      });
    }
  }
}