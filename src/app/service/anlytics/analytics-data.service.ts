import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalyticsData } from '../../model/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsDataService {

  private apiUrl = `${environment.apiUrl}/api/analytics`; // Adjust API endpoint as needed

  constructor(private http: HttpClient) { }

  getAnalyticsData(): Observable<any> {
    return this.http.get<AnalyticsData[]>(this.apiUrl);
  }
}
