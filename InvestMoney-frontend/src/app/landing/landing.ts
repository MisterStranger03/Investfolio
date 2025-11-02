import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var VANTA: any;
declare var THREE: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('vantaHero') vantaHero!: ElementRef;
  @ViewChild('vantaGlobe') vantaGlobe!: ElementRef;
  @ViewChild('vantaTunnel') vantaTunnel!: ElementRef;
  @ViewChild('securityHeadline') securityHeadline!: ElementRef;
  
 
  vantaEffectHero: any;
  vantaEffectGlobe: any;
  vantaEffectTunnel: any;

  private observer!: IntersectionObserver;
  private scrambleInterval: any;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const cards = document.querySelectorAll('.feature-card');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    }
  }

  ngAfterViewInit(): void {
    if (typeof VANTA !== 'undefined' && typeof THREE !== 'undefined') {
      
     
      this.vantaEffectHero = VANTA.GLOBE({
        el: this.vantaHero.nativeElement,
        THREE: THREE, mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
        color: 0x4a55e0, color2: 0x7e22ce, backgroundColor: 0x121212,
        size: 1.2
      });

     
      this.vantaEffectGlobe = VANTA.RINGS({
        el: this.vantaGlobe.nativeElement,
        THREE: THREE, mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
        color: 0x4a55e0, backgroundColor: 0x1e1e1e,
      });

      
      this.vantaEffectTunnel = VANTA.DOTS({
        el: this.vantaTunnel.nativeElement,
        THREE: THREE, mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
        color: 0x4a55e0, color2: 0xa855f7, backgroundColor: 0x1e1e1e,
        size: 3.5, spacing: 35.00
      });
    }
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.vantaEffectHero) this.vantaEffectHero.destroy();
    if (this.vantaEffectGlobe) this.vantaEffectGlobe.destroy();
    if (this.vantaEffectTunnel) this.vantaEffectTunnel.destroy();
    if (this.observer) this.observer.disconnect();
    if (this.scrambleInterval) clearInterval(this.scrambleInterval);
  }
  
  private setupIntersectionObserver(): void {
    const options = { root: null, rootMargin: '0px', threshold: 0.5 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.scrambleText('Hardened Security');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    this.observer.observe(this.securityHeadline.nativeElement);
  }

  private scrambleText(finalText: string): void {
    const element = this.securityHeadline.nativeElement;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    const frameRate = 30; 
    this.scrambleInterval = setInterval(() => {
      let scrambledText = '';
      for (let i = 0; i < finalText.length; i++) {
        if (frame / 2 > i) { scrambledText += finalText[i]; } 
        else { scrambledText += chars[Math.floor(Math.random() * chars.length)]; }
      }
      element.textContent = scrambledText;
      if (frame > finalText.length * 2) {
        element.textContent = finalText;
        clearInterval(this.scrambleInterval);
      }
      frame++;
    }, frameRate);
  }
}