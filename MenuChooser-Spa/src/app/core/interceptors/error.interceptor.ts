import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, Observable, throwError } from "rxjs";

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const messageService = inject(MessageService);

    return next(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 3000 })
                return handleError(error);
            }));
}

function handleError(error: HttpErrorResponse) {
    return throwError(() => error);
}