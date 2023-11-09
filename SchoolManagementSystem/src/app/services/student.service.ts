import { Injectable } from '@angular/core';

export interface Filter {
  label: string;
  value: string;
}
export interface Student {
  id: number;
  name: string;
  year: number;
  class: string;
  // Add more properties as needed, such as address, date of birth, grades, etc.
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor() {}
}
