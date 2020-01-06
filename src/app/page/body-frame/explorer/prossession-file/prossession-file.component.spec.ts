import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProssessionFileComponent } from './prossession-file.component';

describe('ProssessionFileComponent', () => {
  let component: ProssessionFileComponent;
  let fixture: ComponentFixture<ProssessionFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProssessionFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProssessionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
