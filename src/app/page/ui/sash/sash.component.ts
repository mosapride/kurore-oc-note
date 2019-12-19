import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { EnumMouseEventTarget } from '../../../service/mouse-position.service';

@Component({
  selector: 'app-sash',
  template: `<div class="app-sash" draggable="true"></div>`,
  styleUrls: ['./sash.component.scss'],
})
export class SashComponent implements OnInit , AfterViewInit {

  @Input() name: EnumMouseEventTarget;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

}
