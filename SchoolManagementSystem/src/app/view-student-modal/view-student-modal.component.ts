import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../services/student.service';

@Component({
  selector: 'app-view-student-modal',
  templateUrl: './view-student-modal.component.html',
  styleUrls: ['./view-student-modal.component.scss']
})
export class ViewStudentModalComponent {
  student: Student;

  constructor(
    public dialogRef: MatDialogRef<ViewStudentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student) {
      this.student = data;
    }
}
