import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import {EmployeePage} from '../../models/employee-page.model';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule, FormsModule, DecimalPipe],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  employeeForm: FormGroup;
  editingEmployeeId: number | null = null;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  authService = inject(AuthService);
  router = inject(Router);
  showForm = false;
  searchText = '';
  filteredEmployees: Employee[] = [];
  showDeleteDialog = false;
  employeeToDelete: Employee | null = null;

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
    this.employeeService.getEmployees(this.currentPage).subscribe({
      next: (data: EmployeePage) => {
        this.employees = data.content;
        this.filteredEmployees = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading employees:', error)
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
            this.closeForm();
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
            this.closeForm();
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
    this.showForm = true;
  }

  deleteEmployee(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (!this.employeeToDelete) {
      return;
    }
    const id = this.employeeToDelete.id;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('Employee deleted:', id);
        this.showDeleteDialog = false;
        this.employeeToDelete = null;
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.showDeleteDialog = false;
        this.employeeToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openAddForm(): void {
    this.editingEmployeeId = null;

    this.employeeForm.reset({
      name: '',
      department: '',
      salary: 0
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingEmployeeId = null;

    this.employeeForm.reset({
      name: '',
      department: '',
      salary: 0
    });
  }

  searchEmployees(): void {
    const search = this.searchText
      .trim()
      .toLowerCase();

    if (!search) {
      this.filteredEmployees = this.employees;
      return;
    }

    this.filteredEmployees = this.employees.filter(employee =>
      employee.name.toLowerCase().includes(search) ||
      employee.dept.toLowerCase().includes(search)
    );
  }
}
