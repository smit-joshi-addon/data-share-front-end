import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalyticsData } from '../../model/analytics.model';
import { NbAuthService } from '@nebular/auth';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsDataService {

  private apiUrl = `${environment.apiUrl}/api/analytics`;

  private eventSource: EventSource;

  constructor(private http: HttpClient, private authService: NbAuthService) { }

  getAnalyticsData(): Observable<AnalyticsData[]> {
    return this.http.get<AnalyticsData[]>(this.apiUrl);
  }

  getRealtimeAnalyticsData(): Observable<any> {
    return new Observable(observer => {
      this.authService.getToken().subscribe(token => {
        this.eventSource = new EventSource(`${environment.apiUrl}/api/proxy/stream?token=${token.getValue()}`);

        this.eventSource.onmessage = event => {
          try {
            // Parse the data as JSON
            const parsedData = JSON.parse(event.data);
            observer.next(parsedData);
          } catch (e) {
            console.error('Error parsing SSE data:', e);
            observer.error(e);
          }
        };

        this.eventSource.onerror = error => {
          observer.error(error);
        };

        this.eventSource.onopen = () => {
          console.log('SSE connection opened');
        };
      });
    });
  }
}
