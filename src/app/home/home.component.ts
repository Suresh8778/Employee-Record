import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../employee.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  employeeList: any[] = [];
  selectedEmployee: any = null;
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  searchId: string = '';
  searchName: string = '';
  searchDepartment: string = '';
  searchStatus: string = '';

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employeeList = res.sort(
          (a: any, b: any) =>
            new Date(b._id).getTime() - new Date(a._id).getTime()
        );
      },
      error: (err) => {
        console.error('Failed to load employees', err);
      },
    });
  }

  get filteredEmployees() {
    return this.employeeList.filter((emp) => {
      const fullName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
      return (
        emp.employeeId.toLowerCase().includes(this.searchId.toLowerCase()) &&
        fullName.includes(this.searchName.toLowerCase()) &&
        emp.department
          .toLowerCase()
          .includes(this.searchDepartment.toLowerCase()) &&
        (this.searchStatus === '' || emp.employeeStatus === this.searchStatus)
      );
    });
  }

  paginatedEmployees() {
    const filtered = this.filteredEmployees;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  totalPagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  onAddEmployee(): void {
    this.router.navigate(['/employee']);
  }

  onEdit(emp: any): void {
    this.router.navigate(['/employee'], { state: { employee: emp } });
  }

  viewEmployee(emp: any) {
    this.selectedEmployee = emp;
    const modal = new bootstrap.Modal(
      document.getElementById('employeeDetailModal')!
    );
    modal.show();
  }

  toggleAllSelection(event: any): void {
    const checked = event.target.checked;
    this.paginatedEmployees().forEach((emp) => (emp.selected = checked));
  }

  areAllSelected(): boolean {
    return (
      this.paginatedEmployees().length > 0 &&
      this.paginatedEmployees().every((emp) => emp.selected)
    );
  }

  onDeleteSelected(): void {
    const selectedIds = this.employeeList
      .filter((emp) => emp.selected)
      .map((emp) => emp._id);

    if (selectedIds.length === 0) {
      alert('Please select employees to delete.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete employee.?`);
    if (!confirmDelete) return;

    this.employeeService.deleteEmployees(selectedIds).subscribe({
      next: () => {
        alert('Selected employee deleted successfully.');
        this.fetchEmployees();
      },
      error: (err) => {
        console.error('Error deleting employees:', err);
        alert('Failed to delete selected employees.');
      },
    });
  }
}
