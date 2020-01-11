import { SAVE_DIALOG } from './electron-dialog.service';
/* --------------------------------------------------------------------
 * Activeファイル管理サービス.
 *
 * 現在選択中のファイルの管理を行う.
 * --------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { IPossessionFiles } from './file-tree.service';
import { Subject } from 'rxjs';
import { ElectronDialogService } from './electron-dialog.service';
import { ElectronService } from '../core/services';
import { sep } from 'path';


@Injectable({
  providedIn: 'root'
})
export class ActiveFileManagerService {
  // ファイル内容変更フラグ
  activeContentChangeFlg = false;
  // ファイル
  activePossesionFiles: IPossessionFiles;
  // markdownデータ内容
  markdownContents: string;
  $markdownContentsSubject: Subject<string>;
  $activeFileSubject: Subject<IPossessionFiles>;


  constructor(private dialog: ElectronDialogService, private es: ElectronService) {
    this.$activeFileSubject = new Subject<IPossessionFiles>();
    this.$markdownContentsSubject = new Subject<string>();
  }


  setActiveMd(file: IPossessionFiles): void {
    if (this.compareActiveFile(file)) {
      return;
    }

    if (this.activeContentChangeFlg) {
      const res = this.dialog.showFileSaveDialog(file);
      switch (res) {
        case SAVE_DIALOG.save:
          this.save(this.activePossesionFiles);
        case SAVE_DIALOG.not_save:
          break;
        case SAVE_DIALOG.cancel:
          return;
      }
    }

    this.activePossesionFiles = file;
    this.activeContentChangeFlg = false;
    this.$activeFileSubject.next(this.activePossesionFiles);
  }

  getActiveMd(): IPossessionFiles {
    return this.activePossesionFiles;
  }

  /**
   * コンテンツ内容変更フラグを立てる.
   *
   * @memberof ActiveFileManagerService
   */
  setMdContentChange(markdownContents: string) {
    this.markdownContents = markdownContents;
    this.activeContentChangeFlg = true;
    this.$markdownContentsSubject.next(this.markdownContents);
  }

  /**
   * コンテンツ内容が変更されたかを返す.
   *
   * @returns {boolean} true=変更、false=未変更.
   * @memberof ActiveFileManagerService
   */
  isMdContentChanged(): boolean {
    return this.activeContentChangeFlg;
  }


  /**
   * Activeファイルとの比較と同等か比較する
   *
   * @param {IPossessionFiles} file
   * @returns {boolean}
   * @memberof ActiveFileManagerService
   */
  compareActiveFile(file: IPossessionFiles): boolean {
    if (!this.activePossesionFiles) {
      return false;
    }
    if (this.activePossesionFiles.dir === file.dir && this.activePossesionFiles.name === file.name) {
      return true;
    }
    return false;
  }


  save(file: IPossessionFiles, text?: string) {
    if (text) {
      this.es.fs.writeFileSync(file.dir + sep + file.name, text);
    } else {
      this.es.fs.writeFileSync(file.dir + sep + file.name, this.markdownContents);
    }
  }

  readFileMd(file: IPossessionFiles): string {
    return this.es.fs.readFileSync(file.dir + sep + file.name, { encoding: 'utf8' });
  }

}
