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
import { normalize } from 'path';

export enum SAVE_DIALOG {
  save,
  not_save,
  cancel
}

@Injectable({
  providedIn: 'root'
})
export class ElectronDialogService {
  private dialog: Electron.Dialog;
  constructor(
    private es: ElectronService,
    private fileTreeService: FileTreeService
  ) {
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
          this.fileTreeService.setTreeRoot(folders.filePaths[0]);
          this.es.remote.app.relaunch();
          this.es.remote.app.exit(0);
        }
      });
  }

  showFileSaveDialog(file: IPossessionFiles): SAVE_DIALOG {
    if (!file) {
      return SAVE_DIALOG.cancel;
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

    switch (rest) {
      case 0:  // Save
        return SAVE_DIALOG.save
      case 1:  // 変更を破棄
        return SAVE_DIALOG.not_save
    }
    return SAVE_DIALOG.cancel;
  }


  /**
   * フォルダ・ファイル作成確認ダイアログ
   *
   * @param {string} makeFileName
   * @returns {boolean}
   * @memberof ElectronDialogService
   */
  makeFileOrDirectoryDialog(makeFileName: string): boolean {
    const option = new class implements MessageBoxSyncOptions {
      type?: string;
      buttons = ["OK", "Cancel"];
      defaultId?: number;
      title = `OC Note`;
      message = `Create Directory/File \n"${normalize(makeFileName)}" ?`;
      detail?: string;
      checkboxLabel?: string;
      checkboxChecked?: boolean;
      icon = 'info';
      cancelId?: number;
      noLink?: boolean;
      normalizeAccessKeys?: boolean;
    };
    const rest = this.dialog.showMessageBoxSync(this.es.remote.getCurrentWindow(), option);

    switch (rest) {
      case 0:
        return true;
    }
    return false;
  }
}
