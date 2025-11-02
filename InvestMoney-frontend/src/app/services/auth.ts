import { Injectable, inject, signal, NgZone } from '@angular/core'; 
import { Router } from '@angular/router';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, sendPasswordResetEmail } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private zone: NgZone = inject(NgZone); 

  public authState$ = authState(this.auth);
  public isAuthenticated = signal<boolean>(false);
  public currentUser: User | null = null;

  constructor() {
    this.authState$.subscribe(user => {
      this.zone.run(() => {
        this.currentUser = user;
        this.isAuthenticated.set(!!user);
      });
    });
  }

  register(credentials: { email: string, password: string }): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(map(c => c.user));
  }

  login(credentials: { email: string, password: string }): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(map(c => c.user));
  }
  
  loginWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      map(userCredential => userCredential.user)
    );
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.zone.run(() => {
      this.router.navigate(['/login']);
    });
  }

  async getToken(): Promise<string | null> {
    if (!this.currentUser) return null;
    return this.currentUser.getIdToken();
  }

  getCurrentUserUID(): string | null {
    return this.currentUser ? this.currentUser.uid : null;
  }
  
  resetPassword(email: string): Observable<void> {
  return from(sendPasswordResetEmail(this.auth, email));
}
}