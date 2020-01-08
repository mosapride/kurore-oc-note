import { IPossessionFiles } from './file-tree.service';
/* -------------------------------------------------------------------------------
 * エレクトロンダイアログサービス.
 *
 * electronによりOS独自のダイアログの管理を行う。
 * -------------------------------------------------------------------------------*/

import { FileTreeService } from './file-tree.service';
import { ElectronService } from './../core/services/electron/electron.service';
import { Injectable } from '@angular/core';
import { MessageBoxSyncOptions } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ElectronDialogService {
  private dialog: Electron.Dialog;
  constructor(private es: ElectronService, private fts: FileTreeService) {
    this.dialog = es.remote.dialog;
  }

  /**
   * ワークスペースの選択.
   *
   * rootディレクトリとなるワークスペースを選択するダイアログを表示し、ワークスペースを決定する。
   *
   * ディレクトリが選択された場合には、`FileTreeService`にTreeのrootが変更されたことを通知する。
   *
   * @returns {void}
   * @memberof ElectronDialogService
   */
  setWorkSpace(): void {
    this.dialog.showOpenDialog(this.es.remote.getCurrentWindow(), { properties: ['openDirectory'] })
      .then(folders => {
        if (folders.filePaths.length === 0) {
          return;
        } else {
          this.fts.setTreeRoot(folders.filePaths[0]);
        }
      });
  }

  showFileSaveDialog(file: IPossessionFiles) {
    if (!file) {
      return;
    }
    const option = new class implements MessageBoxSyncOptions {
      type?: string;
      buttons = ["Save", "Don't Save", "Cancel"];
      defaultId?: number;
      title = `OC Note`;
      message = `Do you want to save the changes made to "${file.name}" ?`;
      detail?: string;
      checkboxLabel?: string;
      checkboxChecked?: boolean;
      icon = 'info';
      cancelId?: number;
      noLink?: boolean;
      normalizeAccessKeys?: boolean;
    };
    const rest = this.dialog.showMessageBoxSync(this.es.remote.getCurrentWindow(), option);

    console.log(`rest = ${rest}`);
    switch (rest) {
      case 0:  // Save
        console.log(1);
        break;
      case 1:  // 変更を破棄
        break;
      case 2:  // 動作をキャンセル
        break;
    }
  }
}
