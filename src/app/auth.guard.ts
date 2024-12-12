import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Akses diizinkan
  } else {
    authService.logout(); // hapus token jika nggak valid
    router.navigate(['/login']); // Arahkan ke halaman login jika tidak login
    return false; // Akses ditolak
  }
};
