import { Injectable } from '@angular/core';
import { ElectronService } from '../core/services';

export enum EStatType {
  file,
  directory,
  not_found
}

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(
    private electronService: ElectronService,
  ) { }


  /**
   * パスで指定されたファイル・ディレクトリのタイプを返す
   *
   * @param {string} path
   * @returns {EStatType}
   * @memberof FileManagerService
   */
  getStatType(path: string): EStatType {
    if (!this.isStatSync(path)) {
      return EStatType.not_found;
    }

    if (this.isFile(path)) {
      return EStatType.file;
    }

    if (this.isDirectory(path)) {
      return EStatType.directory;
    }
  }

  /**
   * ファイルまたはディレクトリが存在する場合は`true`、存在しない場合は`false`を返す
   *
   * @param {string} path ファイルまたはディレクトリのフルパス
   * @returns true=存在する、false=存在しない
   * @memberof FileManagerService
   */
  isStatSync(path: string) {
    try {
      if (this.electronService.fs.statSync(path)) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  /**
   * 指定したフルパスがファイルかチェックを行う
   *
   * @param {string} path ファイルまでのフルパス
   * @returns {boolean} true=ファイル、false=ファイル以外
   * @memberof FileManagerService
   */
  isFile(path: string): boolean {
    try {
      if (this.electronService.fs.statSync(path).isFile()) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * 指定したフルパスがディレクトリかチェックを行う
   *
   * @param {string} path ディレクトリまでのフルパス
   * @returns {boolean}
   * @memberof FileManagerService
   */
  isDirectory(path: string): boolean {
    try {
      if (this.electronService.fs.statSync(path).isDirectory()) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * markdownファイル書き込み処理
   *
   * @param {string} path markdownファイルのフルパス
   * @param {string} text 書き込み内容
   * @memberof FileManagerService
   */
  writeMarkDownSync(path: string, text: string): void {
    this.electronService.fs.writeFileSync(path, text);
  }

  /**
   * markdownファイルを読み込む
   *
   * @param {*} path markdownファイルのフルパス
   * @returns {string} markdownファイル内容(utf8)
   * @memberof FileManagerService
   */
  readMarkdownSync(path): string {
    return this.electronService.fs.readFileSync(path, { encoding: 'utf8' });
  }


  /**
   * ディレクトリを作成する。
   *
   * @param {string} path ディレクトリのフルパス
   * @memberof FileManagerService
   */
  mkdirSync(path: string) {
    this.electronService.fs.mkdirSync(path)
  }

  /**
   * 空ファイルの作成
   *
   * @param {string} path フルパス付きのファイル名
   * @memberof FileManagerService
   */
  touchSync(path: string) {
    this.electronService.fs.closeSync(this.electronService.fs.openSync(path, 'w'));
  }
}