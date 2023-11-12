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
    { label: 'KG', value: 'KG' },
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
  ];
  public primaryClasses: Filter[];
  public kgClasses: Filter[];
  public secondaryClasses: Filter[];
  public primaryYears: Filter[];
  public secondaryYears: Filter[];
  public selectedFilter: string | undefined;
  public selectedYear: string | undefined;
  public selectedClass: string | undefined;

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
    this.primaryClasses = [];
    this.kgClasses = [];
    this.secondaryClasses = [];
    this.primaryYears = [];
    this.secondaryYears = [];
    this.yearOptions = [];
    this.classOptions = [];

    // Populate the yearOptions array with the 9 years
    for (let i = 1; i <= 9; i++) {
      this.yearOptions.push({ label: `Grade ${i}`, value: `${i}` });
      if (i <= 5) {
        this.primaryYears.push({ label: `Grade ${i}`, value: `${i}` });
      } else {
        this.secondaryYears.push({ label: `Grade ${i}`, value: `${i}` });
      }
    }

    // Add KG classes
    for (let i = 1; i <= 3; i++) {
      this.kgClasses.push({ label: `Class ${i}`, value: `${i}` });
    }

    // Add numeric classes from 1 to 5
    for (let i = 1; i <= 5; i++) {
      this.primaryClasses.push({ label: `Class ${i}`, value: `${i}` });
      if (i !== 5) {
        this.secondaryClasses.push({ label: `Class ${i}`, value: `${i}` });
      }
    }
  }

  public ngAfterViewInit() {
    if (undefined !== this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 5;
    }
  }

  public onPrimarySecondaryChange(): void {
    if (this.selectedFilter === 'primary') {
      this.classOptions = [...this.primaryClasses];
      this.yearOptions = [...this.primaryYears];
    } else if(this.selectedFilter === 'secondary'){
      this.classOptions = [...this.secondaryClasses];
      this.yearOptions = [...this.secondaryYears];
    } else {
      this.classOptions = [...this.kgClasses];
      this.yearOptions = [];
      this.selectedYear = undefined;
    }
  }

  public onYearChange(): void {
    if (this.selectedYear === undefined) {
      return;
    }
    if (Number(this.selectedYear) <= 5) {
      this.selectedFilter = 'primary';
      this.classOptions = [...this.primaryClasses];
    } else {
      this.selectedFilter = 'secondary';
      this.classOptions = [...this.secondaryClasses];
    }
  }

  public onSubmit(): void {
    // Handle form submission, filter students, and populate 'students' array
  }
}
