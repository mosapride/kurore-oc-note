import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDirfileComponent } from './new-dirfile.component';

describe('NewDirfileComponent', () => {
  let component: NewDirfileComponent;
  let fixture: ComponentFixture<NewDirfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDirfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDirfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
