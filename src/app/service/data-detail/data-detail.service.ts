import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataDetailDTO } from '../../model/data-detail.model';


@Injectable({
  providedIn: 'root'
})
export class DataDetailService {

  private apiUrl = `${environment.apiUrl}/api/data-details`;

  constructor(private http: HttpClient) { }

  getAllDataDetails(): Observable<DataDetailDTO[]> {
    return this.http.get<DataDetailDTO[]>(this.apiUrl);
  }
}
