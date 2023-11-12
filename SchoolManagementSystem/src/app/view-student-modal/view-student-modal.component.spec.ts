import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentModalComponent } from './view-student-modal.component';

describe('ViewStudentModalComponent', () => {
  let component: ViewStudentModalComponent;
  let fixture: ComponentFixture<ViewStudentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStudentModalComponent]
    });
    fixture = TestBed.createComponent(ViewStudentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
