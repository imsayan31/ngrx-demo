import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  employeeForm: FormGroup;
  editingEmployeeId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  createEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const employeeRequest = this.employeeForm.value;

    // EDIT
    if (this.editingEmployeeId !== null) {
      this.employeeService
        .updateEmployee(this.editingEmployeeId, employeeRequest)
        .subscribe({
          next: (response) => {
            console.log('Employee updated:', response);
            this.loadEmployees();
            this.employeeForm.reset({
              name: '',
              department: '',
              salary: 0
            });
            this.editingEmployeeId = null;
          },
          error: (error) => console.error('Error updating employee:', error)
        });
    }
    // ADD
    else {
      this.employeeService
        .createEmployee(employeeRequest)
        .subscribe({
          next: (response) => {
            console.log('Employee created:', response);
            this.loadEmployees();
            this.employeeForm.reset({
              name: '',
              department: '',
              salary: 0
            });
          },
          error: (error) =>  console.error('Error creating employee:', error)
        });
    }
  }

  editEmployee(employee: Employee): void {
    this.editingEmployeeId = employee.id;
    this.employeeForm.patchValue({
      name: employee.name,
      department: employee.dept,
      salary: employee.salary
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('Employee deleted:', id);
        this.loadEmployees();
      },
      error: (error) => console.error('Error deleting employee:', error)
    });
  }
}
