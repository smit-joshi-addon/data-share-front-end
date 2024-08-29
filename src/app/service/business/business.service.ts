import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business } from '../../model/business.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = `${environment.apiUrl}/api/businesses`; // Base URL for the API

  constructor(private http: HttpClient) { }

  // Create a new business
  addBusiness(business: Business): Observable<Business> {
    return this.http.post<Business>(this.apiUrl, business);
  }

  // Get all businesses
  getBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(this.apiUrl);
  }

  // Update an existing business
  updateBusiness(businessId: number, business: Business): Observable<Business> {
    const url = `${this.apiUrl}/${businessId}`;
    return this.http.put<Business>(url, business);
  }

  // Delete a business
  deleteBusiness(businessId: number): Observable<void> {
    const url = `${this.apiUrl}/${businessId}`;
    return this.http.delete<void>(url);
  }

  // Get a single business by ID
  getBusiness(businessId: number): Observable<Business> {
    const url = `${this.apiUrl}/${businessId}`;
    return this.http.get<Business>(url);
  }
}
