import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly cache = new Map<string, Observable<string>>();

  constructor(private http: HttpClient) {}

  getIcon(iconName: string): Observable<string> {
    const trimmed = iconName?.trim();
    if (!trimmed) {
      return of('');
    }

    const cached = this.cache.get(trimmed);
    if (cached) {
      return cached;
    }

    const req$ = this.http.get(`/icons/${trimmed}.svg`, { responseType: 'text' }).pipe(
      catchError(() => of('')), // Handle errors (e.g., if the SVG doesn't exist)
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.cache.set(trimmed, req$);
    return req$;
  }
}
