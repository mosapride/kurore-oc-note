import { HistoryService } from './../../service/history.service';
import { Component } from '@angular/core';
import { ElectronDialogService } from '../../service/electron-dialog.service';
import { ActiveFileManagerService } from '../../service/active-file-manager.service';
import { FileTreeService } from '../../service/file-tree.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(
    private electronDialogService: ElectronDialogService,
    private activeFileManagerService: ActiveFileManagerService,
    private fileTreeService: FileTreeService,
    public historyService: HistoryService
  ) { }

  /**
   * 保存が無効か
   *
   * @returns {boolean} true:無効,false:有効
   * @memberof MenuComponent
   */
  styleSaveDisable(): boolean {
    return !this.activeFileManagerService.isMdContentChanged();
  }

  save() {
    if (this.activeFileManagerService.isMdContentChanged()) {
      this.activeFileManagerService.save();
    }
  }

  /**
   * ホームボタンが無効か
   *
   * @returns {boolean} true:無効、false：有効
   * @memberof MenuComponent
   */
  styleHomeDisable(): boolean {
    if (typeof this.fileTreeService.treeWorkSpace === 'undefined') {
      return true;
    }
    return false;
  }

  home() {
    if (this.styleHomeDisable()) {
      return;
    }
    this.historyService.clearHistory();

    const url = this.fileTreeService.getHomeMarkdownUrl();
    const poss = this.fileTreeService.getPossessionFiles(url)
    if (poss) {
      this.activeFileManagerService.setActiveMd(poss);
      this.fileTreeService.openDirectory(poss);
    }

  }

  open() {
    this.electronDialogService.setWorkSpace();
  }

  debug() {
    this.electronDialogService.showFileSaveDialog(this.activeFileManagerService.getActiveMd());
  }
}
