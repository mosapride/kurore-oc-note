import { MousePositionService, EnumMouseEventTarget, IMousePositionFire } from './../../service/mouse-position.service';
import { Component, OnInit, AfterContentInit, HostListener, ViewChild, ElementRef } from '@angular/core';

const INIT_EXPLORER_WIDTH = 250;


@Component({
  selector: 'app-body-frame',
  templateUrl: './body-frame.component.html',
  styleUrls: ['./body-frame.component.scss']
})
export class BodyFrameComponent implements OnInit, AfterContentInit {
  readonly ENUM_VIEW = EnumView;
  readonly ENUM_MOUSE_EVENT_TARGET = EnumMouseEventTarget;
  e2vWidth = 0;
  viewElementPxBean = new ViewElementPxBean();
  elementResizer: ElementResizer;

  @ViewChild('viewer', { static: true }) viewer: ElementRef;

  resizeTargetFlg: EnumMouseEventTarget | undefined;
  constructor(private mousePositionService: MousePositionService) {
  }

  private resizeBodyFrameElement() {
    // this.viewElementPxBean.bodyWidth(window.innerWidth);
    // this.viewElementPxBean.bodyHeight(window.innerHeight);

  }

  ngOnInit() {
    this.resizeBodyFrameElement();

  }

  ngAfterContentInit(): void {
    this.elementResizer = new ElementResizer(this.viewElementPxBean);
    this.mousePositionService.$xSubject.subscribe(position => {
      console.log(position);

      this.elementResizer.do(position);
    });
    this.elementResizer.init();
  }

  setResizeTargetName(name: EnumMouseEventTarget) {
    this.resizeTargetFlg = name;
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(e: MouseEvent) {
    this.mousePositionService.setMouseMoveEvent(e);
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(e) {
    this.mousePositionService.resetTarget();
  }

  @HostListener('window:resize', ['$event'])
  onResize(e) {
    this.elementResizer.windowResizeListener();
    console.log(this.viewElementPxBean.get(EnumView.explorerWidth));

  }


  doResize(type: EnumMouseEventTarget) {
    this.resizeTargetFlg = type;
  }

  setMouseDownId(t: EnumMouseEventTarget) {
    this.mousePositionService.setTarget(t);
  }

}

enum EnumView {
  explorerLeft,
  explorerWidth,
  explorer2editor,
  editorLeft,
  editorWidth,
  editor2viewer,
  viewerLeft,
  viewerWidth
};

class ViewElementPxBean {
  private _viewVal = new Map<EnumView, number>();
  constructor() {
    for (let item in EnumView) {
      if (!isNaN(Number(item))) {
        this._viewVal.set(+item, 0);
      }
    }
  }

  set(key: EnumView, val: number | string) {
    this._viewVal.set(key, +val);
  }

  get(key: EnumView): number {
    return this._viewVal.get(key);
  }

  getPx(key: EnumView): string {
    return `${this._viewVal.get(key)}px`;
  }

}

class ElementResizer {
  private _viewElementPxBean: ViewElementPxBean;

  constructor(v: ViewElementPxBean) {
    this._viewElementPxBean = v;
  };

  /**
   * 各コンポーネントの画面サイズを設定
   *
   * @memberof ElementResizer
   */
  init() {
    const ww = window.innerWidth
    let nExplorerWidth = window.innerWidth - INIT_EXPLORER_WIDTH;
    this._viewElementPxBean.set(EnumView.explorerLeft, 0);
    this._viewElementPxBean.set(EnumView.explorerWidth, INIT_EXPLORER_WIDTH);
    this._viewElementPxBean.set(EnumView.explorer2editor, INIT_EXPLORER_WIDTH);
    this._viewElementPxBean.set(EnumView.editorLeft, INIT_EXPLORER_WIDTH);
    this._viewElementPxBean.set(EnumView.editorWidth, nExplorerWidth / 2);
    this._viewElementPxBean.set(EnumView.editor2viewer, INIT_EXPLORER_WIDTH + (nExplorerWidth / 2));
    this._viewElementPxBean.set(EnumView.viewerLeft, INIT_EXPLORER_WIDTH + (nExplorerWidth / 2));
    this._viewElementPxBean.set(EnumView.viewerWidth, nExplorerWidth / 2);
  }


  windowResizeListener(): void {
    let exWidth = this._viewElementPxBean.get(EnumView.explorerWidth);
    let edWidth = this._viewElementPxBean.get(EnumView.editorWidth);
    let viWidth = this._viewElementPxBean.get(EnumView.viewerWidth);

    let mg = window.innerWidth - exWidth;
    let edP = edWidth / (edWidth + viWidth)
    let vip = viWidth / (viWidth + edWidth)

    this._viewElementPxBean.set(EnumView.editorWidth, mg * edP);
    this._viewElementPxBean.set(EnumView.viewerWidth, mg * vip);

    this._viewElementPxBean.set(EnumView.editor2viewer, window.innerWidth - (mg * vip));
    this._viewElementPxBean.set(EnumView.viewerLeft,  window.innerWidth - (mg * vip));
  }


  do(position: IMousePositionFire) {
    switch (position.target) {
      case EnumMouseEventTarget.explorer2editor:
        this.explorer2editor(position.x);
        break;
      case EnumMouseEventTarget.editor2viewer:
        this.editor2viewer(position.x);
        break;
    }
  }

  private explorer2editor(x: number) {
    const ww = window.innerWidth
    let nExplorerWidth = window.innerWidth - x;
    this._viewElementPxBean.set(EnumView.explorerLeft, 0);
    this._viewElementPxBean.set(EnumView.explorerWidth, x);
    this._viewElementPxBean.set(EnumView.explorer2editor, x);
    this._viewElementPxBean.set(EnumView.editorLeft, x);
    this._viewElementPxBean.set(EnumView.editorWidth, nExplorerWidth / 2);
    this._viewElementPxBean.set(EnumView.editor2viewer, x + (nExplorerWidth / 2));
    this._viewElementPxBean.set(EnumView.viewerLeft, x + (nExplorerWidth / 2));
    this._viewElementPxBean.set(EnumView.viewerWidth, nExplorerWidth / 2);

  }

  private editor2viewer(x: number) {
    const ww = window.innerWidth
    let nExplorerWidth = this._viewElementPxBean.get(EnumView.explorerWidth);
    this._viewElementPxBean.set(EnumView.editor2viewer, x);
    this._viewElementPxBean.set(EnumView.viewerLeft, x);
    this._viewElementPxBean.set(EnumView.viewerWidth, ww - x);

    this._viewElementPxBean.set(EnumView.editorWidth, x - nExplorerWidth);
    console.log(x - nExplorerWidth)
  }

}


