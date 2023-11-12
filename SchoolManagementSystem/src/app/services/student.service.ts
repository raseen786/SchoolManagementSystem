import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

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
  id: number | undefined;
  name: string;
  age: number | undefined;
  subjects?: Subjects;
  year: string;
  class: string;
  image: string;
  category: 'primary' | 'secondary' | 'KG' | undefined;
}
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  apiUrl: string = "http://localhost:3000/api";
  constructor(private http: HttpClient) {}

  addStudent(studentData: Student): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addstudent`, studentData);
  }

  public getStudents(formData: {
    filter: string | undefined;
    year: string | undefined;
    class: string | undefined;
  }): Promise<Student[]> {
    return new Promise((resolve, reject) =>
      this.http
        .post<any>(`${this.apiUrl}/students`, formData)
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
  
  public deleteStudent(studentId: string): Observable<void> {
    const url = `${this.apiUrl}/students/${studentId}`; // Adjust the endpoint URL
    return this.http.delete<void>(url);
  }
  
  updateStudent(studentData: Student): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/students/${studentData.id}`, studentData);
  }
}
