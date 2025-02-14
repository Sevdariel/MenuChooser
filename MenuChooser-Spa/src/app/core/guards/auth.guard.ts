import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../authorization/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    messageService.add({ severity: 'error', summary: 'Authorization error', detail: 'User is not logged in', life: 3000 })
    return false;
  }
};
