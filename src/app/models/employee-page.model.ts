import { Employee } from './employee.model';

export interface EmployeePage {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
