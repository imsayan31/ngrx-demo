import {ChangeDetectorRef, Component, computed, effect, inject, OnInit, signal} from '@angular/core';
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

  employees = signal<Employee[]>([]);
  employeeForm: FormGroup;
  editingEmployeeId: number | null = null;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  authService = inject(AuthService);
  router = inject(Router);
  permissionService = inject(PermissionService);
  showForm = false;
  searchText = signal('');
  filteredEmployees = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    if (!search) {
      return this.employees();
    }
    return this.employees().filter((employee: Employee) =>
      employee.name.toLowerCase().includes(search) ||
      employee.dept.toLowerCase().includes(search)
    );
  });
  showDeleteDialog = signal(false);
  employeeToDelete = signal<Employee | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  isDeleting = signal(false);

  signal1 = signal(10);
  signal2 = signal(20);
  signal3 = signal(30);
  signal4 = signal(40);
  signal5 = signal(50);

  updateSignal1(): void {
    this.signal1.update(value => value * 2);
  }
  updateSignal2(): void {
    this.signal2.update(value => value * 2);
  }
  updateSignal3(): void {
    this.signal3.update(value => value * 2);
  }
  updateSignal4(): void {
    this.signal4.update(value => value * 2);
  }
  updateSignal5(): void {
    this.signal5.update(value => value * 2);
  }


  successMessage = signal('');
  errorMessage = signal('');
  private messageTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1)]]
    });

    effect(() => {
      console.log('Signal 1:', this.signal1());
      console.log('Signal 3:', this.signal3());
      console.log('Signal 4:', this.signal4());
    });

    effect(() => {
      console.log('Signal 2:', this.signal2());
    });

    effect(() => {
      console.log('Signal 5:', this.signal5());
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    // this.clearMessages();
    this.employeeService
      .getEmployees(this.currentPage)
      .subscribe({
        next: (data: EmployeePage) => {
          this.employees.set(data.content);
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.isLoading.set(false);
          this.showError('Unable to load employees. Please try again.');
        }
      });
  }

  clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  createEmployee(): void {
    this.clearMessages();
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const employeeRequest = this.employeeForm.value;

    this.isSaving.set(true);
    // EDIT
    if (this.editingEmployeeId !== null) {
      this.employeeService
        .updateEmployee(this.editingEmployeeId, employeeRequest)
        .subscribe({
          next: (response) => {
            console.log('Employee updated:', response);
            this.isSaving.set(false);
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
            this.isSaving.set(false);
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
            this.isSaving.set(false);
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
            this.isSaving.set(false);
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
    this.employeeToDelete.set(employee);
    this.showDeleteDialog.set(true);
  }

  confirmDelete(): void {

    if (!this.employeeToDelete) {
      return;
    }

    const id = this.employeeToDelete()!.id;

    this.clearMessages();

    this.isDeleting.set(true);

    this.employeeService.deleteEmployee(id).subscribe({

      next: () => {

        console.log('Employee deleted:', id);

        this.isDeleting.set(false);

        this.showDeleteDialog.set(false);
        this.employeeToDelete.set(null);

        this.showSuccess(
          'Employee deleted successfully.'
        );

        this.loadEmployees();
      },

      error: (error) => {

        console.error('Error deleting employee:', error);

        this.isDeleting.set(false);

        this.showDeleteDialog.set(false);
        this.employeeToDelete.set(null);

        this.showError('Unable to delete employee. Please try again.');
      }

    });
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.employeeToDelete.set(null);
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

  searchEmployees(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  showSuccess(message: string): void {
    this.clearMessageTimer();
    this.successMessage.set(message);
    this.errorMessage.set('');
    this.messageTimeout = setTimeout(() => {
      this.successMessage.set('');
    }, 5000);
  }

  showError(message: string): void {
    this.clearMessageTimer();
    this.errorMessage.set(message);
    this.successMessage.set('');
    this.messageTimeout = setTimeout(() => {
      this.errorMessage.set('');
    }, 5000);
  }

  private clearMessageTimer(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }
}
