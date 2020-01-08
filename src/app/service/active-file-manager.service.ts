/* --------------------------------------------------------------------
 * Activeファイル管理サービス.
 *
 * 現在選択中のファイルの管理を行う.
 * --------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { IPossessionFiles } from './file-tree.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ActiveFileManagerService {
  // ファイル内容変更フラグ
  contentChangeFlg = false;
  possessionFiles: IPossessionFiles;
  $activeFileSubject: Subject<IPossessionFiles>;
  constructor() {
    this.$activeFileSubject = new Subject<IPossessionFiles>();
  }


  setActiveFile(file: IPossessionFiles): void {
    this.possessionFiles = file;
    this.contentChangeFlg = false;
    this.activeFileSubjectNext();
  }

  getActiveFile(): IPossessionFiles {
    return this.possessionFiles;
  }

  /**
   * コンテンツ内容変更フラグを立てる.
   *
   * @memberof ActiveFileManagerService
   */
  setContentChange() {
    this.contentChangeFlg = true;
  }

  /**
   * コンテンツ内容が変更されたかを返す.
   *
   * @returns {boolean} true=変更、false=未変更.
   * @memberof ActiveFileManagerService
   */
  isContentChanged(): boolean {
    return this.contentChangeFlg;
  }


  /**
   * Activeファイルとの比較と同等か比較する
   *
   * @param {IPossessionFiles} file
   * @returns {boolean}
   * @memberof ActiveFileManagerService
   */
  compareActiveFile(file: IPossessionFiles): boolean {
    if (this.possessionFiles.dir === file.dir && this.possessionFiles.name === file.name) {
      return true;
    }
    return false;
  }

  private activeFileSubjectNext(): void {
    this.$activeFileSubject.next(this.possessionFiles);
  }
}
