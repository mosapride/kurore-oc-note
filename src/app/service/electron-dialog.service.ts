/* -------------------------------------------------------------------------------
 * エレクトロンダイアログサービス.
 *
 * electronによりOS独自のダイアログの管理を行う。
 * -------------------------------------------------------------------------------*/

import { FileTreeService } from './file-tree.service';
import { ElectronService } from './../core/services/electron/electron.service';
import { Injectable } from '@angular/core';

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
}
