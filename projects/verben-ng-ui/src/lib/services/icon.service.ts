import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private http: HttpClient) {}

  getIcon(iconName: string): Observable<string> {
    return this.http.get(`/icons/${iconName}.svg`, { responseType: 'text' }).pipe(
      catchError(() => of('')) // Handle errors (e.g., if the SVG doesn't exist)
    );
  }
}