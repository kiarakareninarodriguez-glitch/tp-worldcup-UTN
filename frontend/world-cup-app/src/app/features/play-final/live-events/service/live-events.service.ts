import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveEventsService {

  private apiUrl = 'http://localhost:4101/worldCupCore/final-match/live-events';

  constructor(private http: HttpClient) {}

  getLiveEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}