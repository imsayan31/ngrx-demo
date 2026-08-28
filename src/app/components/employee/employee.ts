import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import {EmployeePage} from '../../models/employee-page.model';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {PermissionService} from '../../services/permission.service';

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
  permissionService = inject(PermissionService);
  showForm = false;
  searchText = '';
  filteredEmployees: Employee[] = [];
  showDeleteDialog = false;
  employeeToDelete: Employee | null = null;
  isLoading = false;
  isSaving = false;
  isDeleting = false;

  successMessage = '';
  errorMessage = '';
  private messageTimeout?: ReturnType<typeof setTimeout>;

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

    this.isLoading = true;
    // this.clearMessages();

    this.employeeService
      .getEmployees(this.currentPage)
      .subscribe({

        next: (data: EmployeePage) => {

          this.employees = data.content;
          this.filteredEmployees = data.content;

          this.totalPages = data.totalPages;
          this.currentPage = data.number;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('Error loading employees:', error);

          this.isLoading = false;
          this.showError('Unable to load employees. Please try again.');
        }

      });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  createEmployee(): void {
    this.clearMessages();
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const employeeRequest = this.employeeForm.value;

    this.isSaving = true;
    // EDIT
    if (this.editingEmployeeId !== null) {
      this.employeeService
        .updateEmployee(this.editingEmployeeId, employeeRequest)
        .subscribe({
          next: (response) => {
            console.log('Employee updated:', response);
            this.isSaving = false;
            this.showSuccess(
              'Employee updated successfully.'
            );
            this.loadEmployees();
            this.closeForm();
            this.employeeForm.reset({
              name: '',
              department: '',
              salary: 0
            });
            this.editingEmployeeId = null;
          },
          error: (error) => {
            console.error('Error updating employee:', error)
            this.isSaving = false;
            this.showError('Unable to update employee. Please try again.');
          }
        });
    }
    // ADD
    else {
      this.employeeService
        .createEmployee(employeeRequest)
        .subscribe({
          next: (response) => {
            console.log('Employee created:', response);
            this.isSaving = false;
            this.showSuccess(
              'Employee added successfully.'
            );
            this.loadEmployees();
            this.closeForm();
            this.employeeForm.reset({
              name: '',
              department: '',
              salary: 0
            });
          },
          error: (error) =>  {
            console.error('Error creating employee:', error)
            this.isSaving = false;
            this.showError('Unable to add employee. Please try again.');
          }
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

    this.clearMessages();

    this.isDeleting = true;

    this.employeeService.deleteEmployee(id).subscribe({

      next: () => {

        console.log('Employee deleted:', id);

        this.isDeleting = false;

        this.showDeleteDialog = false;
        this.employeeToDelete = null;

        this.showSuccess(
          'Employee deleted successfully.'
        );

        this.loadEmployees();
      },

      error: (error) => {

        console.error('Error deleting employee:', error);

        this.isDeleting = false;

        this.showDeleteDialog = false;
        this.employeeToDelete = null;

        this.showError('Unable to delete employee. Please try again.');
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

  showSuccess(message: string): void {

    this.clearMessageTimer();

    this.successMessage = message;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.messageTimeout = setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  showError(message: string): void {

    this.clearMessageTimer();

    this.errorMessage = message;
    this.successMessage = '';
    this.cdr.detectChanges();

    this.messageTimeout = setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  private clearMessageTimer(): void {

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }
}
