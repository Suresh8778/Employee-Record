// employee-details.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  existingId: string | null = null;

  departments = ['HR', 'Finance', 'Engineering', 'Marketing'];
  jobTitles = ['Software Developer', 'Manager', 'Accountant', 'HR Executive'];
  genders = ['Male', 'Female'];
  employmentTypes = ['Full-Time', 'Part-Time', 'Contract'];
  statuses = ['Active', 'Inactive'];

  tabList = ['personal', 'employment', 'compensation', 'address'];
  currentTabIndex = 0;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navState: any = this.location.getState();
    const emp = navState?.employee;

    this.isEditMode = !!emp?._id;
    this.existingId = emp?._id || null;

    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      department: ['', Validators.required],
      jobTitle: ['', Validators.required],
      hireDate: ['', Validators.required],
      employmentType: ['', Validators.required],
      employeeStatus: ['', Validators.required],
      manager: [''],
      salary: ['', Validators.required],
      payFrequency: [''],
      bankAccount: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });

    if (this.isEditMode && emp) {
      this.employeeForm.patchValue({
        ...emp,
        dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
        hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
      });
    }
  }

  onSave(): void {
    if (this.employeeForm.valid) {
      const payload = { ...this.employeeForm.value };

      if (this.isEditMode && this.existingId) {
        payload._id = this.existingId;

        this.employeeService
          .updateEmployee(this.existingId, payload)
          .subscribe({
            next: () => {
              alert('Employee updated successfully');
              this.employeeForm.reset();
              this.currentTabIndex = 0;
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('Update failed:', err);
              alert('Failed to update employee.');
            },
          });
      } else {
        this.employeeService.saveEmployee(payload).subscribe({
          next: () => {
            alert('Employee saved successfully');
            this.employeeForm.reset();
            this.currentTabIndex = 0;
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Save failed:', err);
            alert('Failed to save employee.');
          },
        });
      }
    } else {
      this.employeeForm.markAllAsTouched();
      alert('Please complete all required fields.');
    }
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel?')) {
      this.employeeForm.reset();
      this.currentTabIndex = 0;
      this.activateTab(this.tabList[0]);
    }
  }

  onNext(): void {
    if (this.currentTabIndex < this.tabList.length - 1) {
      this.currentTabIndex++;
      this.activateTab(this.tabList[this.currentTabIndex]);
    }
  }

  onPrevious(): void {
    if (this.currentTabIndex > 0) {
      this.currentTabIndex--;
      this.activateTab(this.tabList[this.currentTabIndex]);
    }
  }

  activateTab(tabId: string): void {
    const tabButton = document.querySelector(`#${tabId}-tab`) as HTMLElement;
    if (tabButton) tabButton.click();
  }

  onTabClick(tabId: string): void {
    this.currentTabIndex = this.tabList.indexOf(tabId);
  }
}
