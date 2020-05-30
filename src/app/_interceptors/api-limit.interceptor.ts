import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ApiLimitInterceptor implements HttpInterceptor {


  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse),
      tap((event: HttpResponse<any>) => {
        if (event.body['Note']) {
          this.snackBar.open(event.body['Note'], 'close', {
            duration: 5000,
            panelClass: 'mat-primary'
          });
          this.snackBar._openedSnackBarRef.afterDismissed().subscribe(s => {
            this.router.navigateByUrl('/');
          });
        }
      })
    );
  }
}
