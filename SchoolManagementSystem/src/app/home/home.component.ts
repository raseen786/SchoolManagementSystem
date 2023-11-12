import { Component, ViewChild } from '@angular/core';
import { Filter, Student, StudentService } from '../services/student.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NewStudentModalComponent } from '../new-student-modal/new-student-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewStudentModalComponent } from '../view-student-modal/view-student-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public classOptions: Filter[];
  public errorMessage: string = '';

  public dataSource: MatTableDataSource<Student>;
  public displayedColumns: string[] = [
    'id',
    'name',
    'year',
    'class',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  public primarySecondaryOptions: Filter[] = [
    { label: 'KG', value: 'KG' },
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
  ];
  public editingStudent: Student; // Track the currently editing student

  public primaryClasses: Filter[];
  public kgClasses: Filter[];
  public secondaryClasses: Filter[];
  public primaryYears: Filter[];
  public secondaryYears: Filter[];
  public selectedFilter: string | undefined;
  public selectedYear: string | undefined;
  public selectedClass: string | undefined;

  public yearOptions: Filter[];

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Student>();
    this.primaryClasses = [];
    this.kgClasses = [];
    this.secondaryClasses = [];
    this.primaryYears = [];
    this.secondaryYears = [];
    this.yearOptions = [];
    this.classOptions = [];
    this.editingStudent = {
      id: undefined,
      name: '',
      year: '',
      class: '',
      image: '',
      age: undefined,
      category: undefined,
    };

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

  openNewStudentModal(): void {
    const dialogRef = this.dialog.open(NewStudentModalComponent, {
      width: '600px',
      data: {
        name: '',
        grade: '',
        subjects: { math: '', science: '', english: '' },
        year: this.selectedYear,
        class: this.selectedClass,
        image: '',
        category: this.selectedFilter,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit();
        // Add logic to process the new student data, e.g., send it to the server
      }
    });
  }

  public showAddStudent() {
    if (this.selectedFilter === undefined || this.selectedClass === undefined) {
      return false;
    }
    if (this.selectedFilter !== 'KG' && this.selectedYear === undefined) {
      return false;
    }
    return true;
  }

  public viewStudent(student: any): void {
    // Open the view student modal
    this.dialog.open(ViewStudentModalComponent, {
      width: '350px',
      data: student,
    });
  }

  public deleteStudent(student: any): void {
    this.studentService.deleteStudent(student.id).subscribe({
      next: (response) => {
        console.log('Successfully added student:', response);
        // Add any additional logic or close the modal as needed
        this.onSubmit();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Error deleting student';
        console.log(error);
      },
    });
  }

  editStudent(student: Student): void {
    this.errorMessage = '';
    this.editingStudent = { ...student }; // Create a copy for editing
  }

  saveStudent(): void {
    if (this.editingStudent) {
      // Update the student in the data source
      const index = this.dataSource.data.findIndex(
        (s) => s.id === this.editingStudent?.id
      );
      if (index !== -1) {
        this.dataSource.data[index] = { ...this.editingStudent };
        // Save the changes to the server if needed (call a service method)
        this.studentService.updateStudent(this.editingStudent).subscribe({
          next: (response) => {
            this.onSubmit();
            this.cancelEdit();
            console.log('Successfully update student:', response);
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = 'Error editing student';
            console.log(error);
          },
        });
      }
    }
  }

  cancelEdit(): void {
    this.editingStudent = {
      id: undefined,
      name: '',
      year: '',
      class: '',
      image: '',
      age: undefined,
      category: undefined,
    };
  }
}
