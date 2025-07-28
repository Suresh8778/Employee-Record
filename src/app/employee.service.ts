import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://localhost:3000/api/employees'; 

  constructor(private http: HttpClient) {}

  saveEmployee(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getAllEmployees() {
  return this.http.get<any[]>('http://localhost:3000/api/employees');
}

updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

deleteEmployees(ids: string[]) {
  return this.http.post('http://localhost:3000/api/employees/delete-multiple', { ids });
}


}
