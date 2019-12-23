import { Injectable } from '@angular/core';
import { StandardMouseEvent } from '../clazz/mouseEvent';

import { Subject } from 'rxjs';

export enum EnumMouseEventTarget {
  explorer2editor,
  editor2viewer,
}

export interface IMousePositionFire {
  target: EnumMouseEventTarget;
  x: number;
}


@Injectable({
  providedIn: 'root'
})
export class MousePositionService {
  target: EnumMouseEventTarget | undefined;
  standardMouseEvent: StandardMouseEvent;
  $xSubject: Subject<IMousePositionFire>;

  constructor() {
    this.target = undefined;
    this.$xSubject = new Subject<IMousePositionFire>();
  }

  setMouseMoveEvent(e: MouseEvent) {
    if (this.target === undefined) {
      return;
    }
    this.standardMouseEvent = new StandardMouseEvent(e);
    let impf: IMousePositionFire = {
      target: this.target,
      x: this.standardMouseEvent.posx
    }
    this.$xSubject.next(impf);
    e.preventDefault();
  }

  setTarget(t: EnumMouseEventTarget | undefined) {
    this.target = t;
  }
  resetTarget() {
    this.setTarget(undefined);
  }


}
