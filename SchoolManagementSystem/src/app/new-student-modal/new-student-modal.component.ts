import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student, StudentService } from '../services/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-student-modal',
  templateUrl: './new-student-modal.component.html',
  styleUrls: ['./new-student-modal.component.scss']
})
export class NewStudentModalComponent {
  studentForm: FormGroup;
  public errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<NewStudentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student,
    private formBuilder: FormBuilder,
    private studentService: StudentService
  ) {
    this.studentForm = this.formBuilder.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required],
      age: [data.age, Validators.required],
      class: [data.class, Validators.required],
      category: [data.category, Validators.required],
      image: [data.image, Validators.required],
      subjects: this.formBuilder.group({
        math: [data.subjects?.math],
        science: [data.subjects?.science],
        english: [data.subjects?.english]
      })
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onImageChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return;
      }
      const maxSizeInMB = 2; // 2MB
      if (file.size > maxSizeInMB * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        this.studentForm.patchValue({ image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  }

  // Custom file validator
  fileValidator() {
    return (control: { value: File }) => {
      const file = control.value;
      if (file) {
        
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value as Student;
      this.studentService.addStudent(formData)
      .subscribe({
        next: (response) => {
          console.log('Successfully added student:', response);
          // Add any additional logic or close the modal as needed
          this.dialogRef.close(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding student:', error);
          this.errorMessage = 'Error adding student';
        },
      });
    }
  }
  // You can add more methods or logic to handle form submission here
}
