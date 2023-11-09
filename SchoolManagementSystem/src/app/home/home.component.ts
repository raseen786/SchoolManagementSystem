import { Component, ViewChild } from '@angular/core';
import { Filter, Student } from '../services/student.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public classOptions: Filter[];

  public dataSource: MatTableDataSource<Student>;
  public displayedColumns: string[] = ['id', 'name', 'year', 'class'];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  public primarySecondaryOptions: Filter[] = [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
  ];
  public primaryYears: Filter[];
  public secondaryYears: Filter[];
  public selectedFilter: string | undefined;

  public students: Student[] = [
    { id: 1, name: 'Alice', year: 1, class: 'Class A' },
    { id: 2, name: 'Bob', year: 2, class: 'Class B' },
    { id: 3, name: 'Charlie', year: 3, class: 'Class C' },
    { id: 4, name: 'David', year: 1, class: 'Class A' },
    { id: 5, name: 'Eva', year: 2, class: 'Class B' },
    { id: 6, name: 'Frank', year: 3, class: 'Class C' },
    { id: 7, name: 'Grace', year: 1, class: 'Class A' },
    { id: 8, name: 'Henry', year: 2, class: 'Class B' },
    { id: 9, name: 'Ivy', year: 3, class: 'Class C' },
    { id: 10, name: 'Jack', year: 1, class: 'Class A' },
    { id: 11, name: 'Katie', year: 2, class: 'Class B' },
    { id: 12, name: 'Leo', year: 3, class: 'Class C' },
  ];

  public yearOptions: Filter[];

  constructor() {
    this.dataSource = new MatTableDataSource<Student>(this.students);
    this.primaryYears = [];
    this.secondaryYears = [];
    this.yearOptions = [];
    const currentYear = new Date().getFullYear();

    // Populate the yearOptions array with the last 12 years
    for (let i = currentYear; i > currentYear - 30; i--) {
      this.yearOptions.push({ label: `${i}`, value: `${i}` });
    }

    // Add KG classes
    for (let i = 1; i <= 3; i++) {
      this.primaryYears.push({ label: `KG-${i}`, value: `KG-${i}` });
    }

    // Add numeric classes from 1 to 5
    for (let i = 1; i <= 5; i++) {
      this.primaryYears.push({ label: `Class ${i}`, value: `Class${i}` });
      if (i !== 5) {
        this.secondaryYears.push({ label: `Class ${i}`, value: `Class${i}` });
      }
    }
    this.classOptions = this.primaryYears.slice();
  }

  public ngAfterViewInit() {
    if (undefined !== this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 5;
    }
  }

  public onPrimarySecondaryChange(): void {
    if (this.selectedFilter === 'primary') {
      this.classOptions = [...this.primaryYears];
    } else {
      this.classOptions = [...this.secondaryYears];
    }
  }

  public onSubmit(): void {
    // Handle form submission, filter students, and populate 'students' array
  }
}
