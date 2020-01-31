import { ActiveFileManagerService } from './active-file-manager.service';
import { Injectable } from '@angular/core';
import { IPossessionFiles } from './file-tree.service';


const maxHistoryCnt = 20;

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  possessionFilesHistory: IPossessionFiles[];
  historyNo: number;
  historyFlg = false;

  constructor(
    private activeFileManagerService: ActiveFileManagerService,
  ) {
    this.clearHistory();
    this.activeFileManagerService.$activeFileSubject.subscribe(pos => {
      if (!this.historyFlg) {
        this.addHistory(pos);
      }
      this.historyFlg = false;

    });
  }

  /**
   * 履歴を初期化する
   *
   * @memberof HistoryService
   */
  clearHistory(): void {
    this.possessionFilesHistory = [];
    this.historyNo = 1;
    this.historyFlg = false;
  }

  private addHistory(po: IPossessionFiles): void {
    if (this.possessionFilesHistory.length > this.historyNo) {
      this.possessionFilesHistory = this.possessionFilesHistory.slice(0 , this.historyNo);
    }
    const wk = this.possessionFilesHistory[this.historyNo];
    if (typeof wk !== 'undefined') {
      if (wk.dir === po.dir && wk.name === po.name) {
        this.historyNo = this.possessionFilesHistory.length;
        return;
      }
    }

    this.possessionFilesHistory.push(po);
    this.historyNo = this.possessionFilesHistory.length;
  }

  forwardHistory(): void {
    if (this.hasFowardHistory()) {
      this.historyFlg = true;
      ++this.historyNo;
      this.activeFileManagerService.setActiveMd(this.possessionFilesHistory[this.historyNo -1]);
    }
  }


  hasFowardHistory(): boolean {
    if (this.possessionFilesHistory.length > this.historyNo) {
      return true;
    }
    return false;
  }

  backHistory(): void {
    this.historyFlg = true;
    if (this.hasBackHistory()) {
      --this.historyNo;
      this.activeFileManagerService.setActiveMd(this.possessionFilesHistory[this.historyNo - 1]);
    }
  }

  hasBackHistory(): boolean {
    if (this.historyNo >= 2) {
      return true;
    }
    return false;
  }

}
