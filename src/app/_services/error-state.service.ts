import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ErrorStateService {

  constructor(
    private router: Router,
    private location: Location
  ) { }

  navigate404(preservedUrl: string) {
    this.router.navigate(['**'], { skipLocationChange: true }).then(() => {
      this.location.replaceState(preservedUrl);
    });
  }
}
