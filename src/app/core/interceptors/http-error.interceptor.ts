import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let friendlyMessage = 'An unexpected error occurred. Please try again.';

      if (error.status === 0) {
        friendlyMessage = 'Network error: Unable to connect to server. Please check your connection.';
      } else if (error.status === 404) {
        friendlyMessage = 'Resource not found.';
      } else if (error.status === 400) {
        friendlyMessage = typeof error.error === 'string' ? error.error : 'Invalid request payload.';
      } else if (error.status >= 500) {
        friendlyMessage = 'Server error encountered. Please try again later.';
      } else if (typeof error.error === 'string' && error.error.trim()) {
        friendlyMessage = error.error;
      }

      // Return an error object preserving status and code, but enriched with normalized friendlyMessage
      const enhancedError = new Error(friendlyMessage);
      (enhancedError as unknown as { status: number; originalError: HttpErrorResponse }).status = error.status;
      (enhancedError as unknown as { status: number; originalError: HttpErrorResponse }).originalError = error;

      return throwError(() => enhancedError);
    })
  );
};
