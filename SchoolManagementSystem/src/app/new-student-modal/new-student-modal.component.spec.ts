import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudentModalComponent } from './new-student-modal.component';

describe('NewStudentModalComponent', () => {
  let component: NewStudentModalComponent;
  let fixture: ComponentFixture<NewStudentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewStudentModalComponent]
    });
    fixture = TestBed.createComponent(NewStudentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
