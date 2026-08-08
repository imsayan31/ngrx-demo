import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Employee} from '../models/employee.model';
import {EmployeeRequest} from '../models/employee-request.model';
import {EmployeePage} from '../models/employee-page.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getEmployees(page: number = 0, size: number = 5) {
    return this._http.get<EmployeePage>(
      `${this.apiUrl}/employees?page=${page}&size=${size}`
    );
  }

  createEmployee(employee: EmployeeRequest) {
    return this._http.post<Employee>(
      `${this.apiUrl}/employee`,
      employee
    );
  }

  updateEmployee(id: number, employee: EmployeeRequest) {
    return this._http.put<Employee>(
      `${this.apiUrl}/employee/${id}`,
      employee
    );
  }

  deleteEmployee(id: number) {
    return this._http.delete<void>(
      `${this.apiUrl}/employee/${id}`
    );
  }
}
