// src/app/services/data-master.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataMaster } from '../../model/data-master.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataMasterService {
  private apiUrl = `${environment.apiUrl}/api/datamaster`;

  constructor(private http: HttpClient) { }

  // Get all master records
  getMasterRecords(): Observable<DataMaster[]> {
    return this.http.get<DataMaster[]>(this.apiUrl);
  }

  // Add a new master record
  addMasterRecord(data: DataMaster): Observable<DataMaster> {
    return this.http.post<DataMaster>(this.apiUrl, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Update an existing master record
  updateMasterRecord(sharingId: number, data: DataMaster): Observable<DataMaster> {
    return this.http.put<DataMaster>(`${this.apiUrl}/${sharingId}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Get a specific master record by ID
  getMasterRecord(sharingId: number): Observable<DataMaster> {
    return this.http.get<DataMaster>(`${this.apiUrl}/${sharingId}`);
  }

  // Optionally, add a delete method if needed
  deleteMasterRecord(sharingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sharingId}`);
  }
}
