import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

type ResizeFlgType = 'e2e' | 'e2v' | '';
@Component({
  selector: 'app-body-frame',
  templateUrl: './body-frame.component.html',
  styleUrls: ['./body-frame.component.scss']
})
export class BodyFrameComponent implements OnInit {
  explolerWidht = 200;
  e2vWidth = 0;

  @ViewChild('viewer', { static: true }) viewer: ElementRef;

  resizeFlg: ResizeFlgType = '';
  constructor() { }

  ngOnInit() {
    console.log(this.getWindowWidth());
    this.e2vWidth = this.getEditorWidth();
  }

  /**
   * Window全体の横幅を取得する(px)
   *
   * @private
   * @returns {number} Windowの横幅(px)
   * @memberof BodyFrameComponent
   */
  getWindowWidth(): number {
    return window.innerWidth;
  }

  getEditorWidth(): number {
    return (this.getWindowWidth() - this.explolerWidht) / 2;
  }


  @HostListener('document:mousemove', ['$event'])
  mouseMove(e) {
    console.log(e.clientX);
    switch (this.resizeFlg) {
      case 'e2e':
        if (e.clientX <= 100) {
          this.resizeFlg = '';
          return;
        }
        this.explolerWidht = e.clientX;
        this.e2vWidth = this.getEditorWidth();
        break;
      case 'e2v':
        // console.log(`clientWidth = ${this.viewer.nativeElement.clientWidth}`);
        // let check = this.getWindowWidth() - this.getWindowWidth() - (e.clientX - this.explolerWidht) - this.explolerWidht;

        if (e.clientX >= (this.getWindowWidth() - 100)) {
          this.resizeFlg = '';
          return;
        }

        this.e2vWidth = e.clientX - this.explolerWidht;
        break;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(e) {
    this.resizeFlg = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(e) {
    this.e2vWidth = this.getEditorWidth();
  }


  doResize(type: ResizeFlgType) {
    this.resizeFlg = type;
  }

  getExplolerStyleRight() {
    return this.getWindowWidth() - this.e2vWidth - this.explolerWidht;
  }

  getViewerStyleLeft() {
    return this.getWindowWidth() - this.getExplolerStyleRight();
  }

}
