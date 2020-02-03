import { ElectronService } from './../../../core/services/electron/electron.service';
import { SaveDataService, EJsonPropertyArray, EJsonPropertySingleString } from './../../../service/save-data.service';
import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnInit {

  /**
   * 当コンポーネントが表示されている状態で`Escape`を押した場合に終了させる。
   *
   * @param {KeyboardEvent} event
   * @memberof WorkHistoryComponent
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.showFlg && (event.key === 'Escape')) {
      this.showFlg = false;
    }
  }

  showFlg = false;

  // workSpaces: string[] = [];
  constructor(
    private saveDataService: SaveDataService,
    private electronService: ElectronService,
  ) { }


  ngOnInit() {
    // this.workSpaces = this.saveDataService.readJsonPropatryArray(EJsonPropertyArray.historyWorkSpace);
  }

  public show() {
    this.showFlg = true;
  }

  getWorkSpaceList(): string[] {
    return this.saveDataService.readJsonPropatryArray(EJsonPropertyArray.historyWorkSpace);
  }

  delete(workspace: string) {
    this.saveDataService.deleteListJsonPropatry(EJsonPropertyArray.historyWorkSpace, workspace);
  }


  changeWorkSpace(w: string): void {
    this.saveDataService.writeJsonPropatry(EJsonPropertySingleString.lastWorkSpaceName, w);
    this.electronService.remote.app.relaunch();
    this.electronService.remote.app.exit(0);
  }

  /**
   * 親要素へのクリックイベントの通知を止める。(画面が消えてしまうから)
   *
   * @param {MouseEvent} event
   * @memberof WorkHistoryComponent
   */
  stopPropagation(event : MouseEvent) {
    event.stopPropagation();
  }

}
