import { Component, ViewChild } from '@angular/core';
import { Filter, Student, StudentService } from '../services/student.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public classOptions: Filter[];
  public errorMessage: string = '';

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

  public yearOptions: Filter[];

  constructor(private studentService: StudentService) {
    this.dataSource = new MatTableDataSource<Student>();
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
    this.onSubmit();
    if (undefined !== this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 5;
    }
  }

  public onPrimarySecondaryChange(): void {
    if (this.selectedFilter === 'primary') {
      this.classOptions = [...this.primaryClasses];
      this.yearOptions = [...this.primaryYears];
    } else if (this.selectedFilter === 'secondary') {
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
    // Handle form submission, filter students, and populate 'students' array// Prepare the data to be sent to the server
    const formData = {
      filter: this.selectedFilter,
      year: this.selectedYear,
      class: this.selectedClass,
    };
    this.studentService
      .getStudents(formData)
      .then((data: Student[]) => {
        this.dataSource.data = data;
        // this.dataSource.renderRows();
        this.errorMessage = '';
      })
      .catch(() => {
        this.dataSource.data = [];
        this.errorMessage = 'An error occurred while fetching students.';
      });
  }
}
