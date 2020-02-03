import { FileManagerService } from './file-manager.service';
import { ElectronService } from './../core/services/electron/electron.service';
import { Injectable } from '@angular/core';
import { sep, normalize } from 'path';

// 設定ファイル名称
const JsonInfo = {
  fileName: 'oc-note.json',
  name: 'oc-note',
}

// 設定ファイルプロパティ(配列形式)
export enum EJsonPropertyArray {
  historyWorkSpace = 'historyWorkSpace',
}

// 設定ファイルプロパティ(文字列)
export enum EJsonPropertySingleString {
  lastWorkSpaceName = 'lastWorkSpaceName',
  hightlightTheme = 'hightlightTheme',
  codemirroTheme = 'codemirroTheme',
}

/**
 * 保存データの管理を行う
 *
 * @export
 * @class SaveDataService
 */
@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  constructor(
    private electronService: ElectronService,
    private fileManagerService: FileManagerService,
  ) {
    if (!this.fileManagerService.isFile(this.getJsonFilePath())) {
      const obj = { 'name': JsonInfo.name };
      this.electronService.fs.writeFileSync(this.getJsonFilePath(), JSON.stringify(obj), 'utf8');
    }
  }


  /**
   * 設定ファイルのフルパスを返す。
   *
   * @returns 設定ファイルのフルパス
   * @memberof SaveDataService
   */
  getJsonFilePath() {
    return this.electronService.remote.app.getPath(`appData`) + sep + JsonInfo.fileName;
  }


  /**
   * 設定情報JSONに書き込まれたstring配列形式の情報を読み込む.
   *
   * @private
   * @param {EJsonPropertyArray} key 読み込みkey
   * @returns {string[]} 内容の配列
   * @memberof SaveDataService
   */
  readJsonPropatryArray(key: EJsonPropertyArray): string[] {
    let rtn: string[] = [];
    const json = JSON.parse(this.fileManagerService.readFile(this.getJsonFilePath()));
    const w = json[key];
    for (let j of w) {
      rtn.push(j + '');
    }
    return rtn;
  }

  /**
   * 設定情報JSONに書き込まれたstring形式の情報を読み込む.
   *
   * @private
   * @param {EJsonPropertySingleString} key 読み込みkey
   * @returns {string} 読み込み内容
   * @memberof SaveDataService
   */
  readJsonPropatry(key: EJsonPropertySingleString): string | undefined {
    const json = JSON.parse(this.fileManagerService.readFile(this.getJsonFilePath()));
    if (json[key]) {
      return json[key] + ''
    }
    return undefined;
  }

  /**
   * 設定情報JSONに書き込まれたstring形式の情報を書き込む.
   *
   * @param {EJsonPropertySingleString} ej 書き込みkey
   * @param {string} contents 書き込み内容
   * @memberof SaveDataService
   */
  writeJsonPropatry(ej: EJsonPropertySingleString, contents: string): void {
    this.fileManagerService.writeJson(this.getJsonFilePath(), ej, contents);

    if (ej === EJsonPropertySingleString.lastWorkSpaceName) {
      this.writeListJsonPropatry(EJsonPropertyArray.historyWorkSpace, contents);
    }
  }

  /**
   * 設定情報JSONに書き込まれたstringの配列形式の情報を書き込む.
   *
   * 同じデータが存在する場合は上書きを行う.
   *
   * @private
   * @param {EJsonPropertyArray} property
   * @param {string} value
   * @memberof SaveDataService
   */
  private writeListJsonPropatry(property: EJsonPropertyArray, value: string) {
    const obj = JSON.parse(this.fileManagerService.readFile(this.getJsonFilePath()));
    if (!(obj[property] instanceof Array)) {
      obj[property] = [];
    }
    let pushFlg = true;
    if (obj[property] instanceof Array) {
      for (const o of obj[property]) {
        if (o === value) {
          pushFlg = false;
          break;
        }
      }
    }
    if (pushFlg) {
      obj[property].push(value);
    }
    this.fileManagerService.writeJson(this.getJsonFilePath(), property, obj[property]);
  }

  /**
   * 設定情報JSONに書き込まれたstringの配列形式の情報を書き込む.
   *
   * 同じデータが存在する場合は上書きを行う.
   *
   * @private
   * @param {EJsonPropertyArray} property
   * @param {string} value
   * @memberof SaveDataService
   */
  deleteListJsonPropatry(property: EJsonPropertyArray, value: string) {
    const obj = JSON.parse(this.fileManagerService.readFile(this.getJsonFilePath()));
    if (!(obj[property] instanceof Array)) {
      obj[property] = [];
    }

    const setValues: string[] = [];
    if (obj[property] instanceof Array) {
      for (const o of obj[property]) {
        if (normalize(o) !== normalize(value)) {
          setValues.push(o);
        }
      }
    }
    this.fileManagerService.writeJson(this.getJsonFilePath(), property, setValues);
  }
}
