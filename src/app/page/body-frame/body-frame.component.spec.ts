import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyFrameComponent } from './body-frame.component';

describe('BodyFrameComponent', () => {
  let component: BodyFrameComponent;
  let fixture: ComponentFixture<BodyFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
