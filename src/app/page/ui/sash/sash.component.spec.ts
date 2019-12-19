import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SashComponent } from './sash.component';

describe('SashComponent', () => {
  let component: SashComponent;
  let fixture: ComponentFixture<SashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
