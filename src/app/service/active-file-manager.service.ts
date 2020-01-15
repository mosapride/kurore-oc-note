import { FileManagerService } from './file-manager.service';
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


  constructor(
    private dialog: ElectronDialogService,
    private es: ElectronService,
    private fileManagerService: FileManagerService
  ) {
    this.$activeFileSubject = new Subject<IPossessionFiles>();
    this.$markdownContentsSubject = new Subject<string>();
  }

  setActiveMd(file: IPossessionFiles): void {
    if (this.compareActiveFile(file)) {
      return;
    }

    if (this.activeContentChangeFlg) {
      const res = this.dialog.showFileSaveDialog(this.activePossesionFiles);
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
  setMdContentChange(markdownContents: string, initFlg = false) {
    this.markdownContents = markdownContents;
    this.activeContentChangeFlg = !initFlg;
    this.$markdownContentsSubject.next(this.markdownContents);
  }

  /**
   * コンテンツ内容が変更されたかを返す.
   *
   * @returns {boolean} true=変更、false=未変更.
   * @memberof ActiveFileManagerService
   */
  isMdContentChanged(): boolean {
    if (this.activePossesionFiles) {
      return this.activeContentChangeFlg;
    }
    return false;
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
      this.fileManagerService.writeMarkDownSync(file.dir + sep + file.name, text);
    } else {
      this.fileManagerService.writeMarkDownSync(file.dir + sep + file.name, this.markdownContents);
    }
  }

  /**
   * 現在アクティブなファイルに対して保存を行う。
   *
   * @param {string} text 保存内容
   * @memberof ActiveFileManagerService
   */
  ctrlS(text: string) {
    if (this.activePossesionFiles) {
      this.save(this.activePossesionFiles, text);
      this.activeContentChangeFlg = false;
    }
  }

  /**
   * markdownファイルを読み込む
   *
   * @param {IPossessionFiles} file
   * @returns {string} Markdown内容
   * @memberof ActiveFileManagerService
   */
  readFileMd(file: IPossessionFiles): string {
    return this.fileManagerService.readMarkdownSync(file.dir + sep + file.name);
  }

  /**
   * アクティブなディレクトリパスを返す。
   *
   * @returns パス
   * @memberof ActiveFileManagerService
   */
  getPath() {
    return this.activePossesionFiles.dir;
  }

  makeDirFile(path: string) {
    const sPath = path.split(sep);
    let checkPath = '';
    for (const s of sPath) {
      checkPath += s;
      let checkFlg = false;
      try {
        const c = this.es.fs.statSync(checkPath);
        if (c.isFile()) {
          checkFlg = true;
        } else if (c.isDirectory()) {
          checkFlg = true;
        } else {
          checkFlg = false;
        }
      } catch {
        checkFlg = false;
      }
      if (checkFlg === false) {

        if (this.dialog.makeFileOrDirectoryDialog(checkPath)) {
          if (checkPath.match(/\.md$/)) {
            this.es.fs.closeSync(this.es.fs.openSync(checkPath, 'w'));
          } else {
            this.es.fs.mkdir(checkPath, (err) => console.log(err));
          }
        }
      }
      checkPath += sep;
    }
  }

}
