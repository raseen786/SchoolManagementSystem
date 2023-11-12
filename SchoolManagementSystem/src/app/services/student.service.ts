import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';

export interface Filter {
  label: string;
  value: string;
}

interface Subjects {
  math: string;
  science: string;
  english: string;
}

// Define an interface for a student
export interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  subjects: Subjects;
  year: string;
  class: string;
  image: string;
  category: 'primary' | 'secondary' | 'KG';
}
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  public getStudents(formData: {
    filter: string | undefined;
    year: string | undefined;
    class: string | undefined;
  }): Promise<Student[]> {
    return new Promise((resolve, reject) =>
      this.http
        .post<any>('http://localhost:3000/api/students', formData)
        .pipe(
          catchError((error) => {
            // Handle any errors from the server
            reject();
            return Promise.reject(error);
          })
        )
        .subscribe((response) => {
          // Handle the server response here
          resolve(response.data);
        })
    );
  }
}
