import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../authorization/auth.service";

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    const clonedRequest = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;

    return next(clonedRequest).pipe(catchError(error => {
        if (error.status === 401) {
            authService.logout();
            router.navigate(['/']);
        }
        return throwError(() => error);
    }));
}