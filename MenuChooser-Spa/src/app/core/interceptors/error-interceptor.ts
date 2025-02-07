import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable, tap, throwError } from "rxjs";

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const toastrService = inject(ToastrService);

    return next(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                toastrService.error(error.error, error.statusText);
                return handleError(error);
            }));
}

function handleError(error: HttpErrorResponse) {
    return throwError(() => error);
}