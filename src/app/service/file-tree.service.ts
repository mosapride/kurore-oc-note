/* -------------------------------------------------------------------------------
 * ファイルツリーサービス.
 *
 * エクスプロラーに必要なディレクトリ・ファイルツリー情報を管理する
 * -------------------------------------------------------------------------------*/

import { sep } from 'path';
import { Injectable } from '@angular/core';
import { ElectronService } from '../core/services';

export interface ITreeWorkSpace {
  dir: string;
  possessionFiles: IPossessionFiles[];
}

export interface IPossessionFiles {
  dir: string;
  name: string;
  depth: number;
  isDirectory: boolean;
  openFlg: boolean;
  possessionFiles: IPossessionFiles[];
}

class PossessionFiles implements IPossessionFiles {
  dir: string;
  name: string;
  depth: number;
  isDirectory: boolean;
  openFlg: boolean;
  possessionFiles: IPossessionFiles[];
  constructor(dir?: string, name?: string, depth?: number, isDirectory?: boolean, openFlg?: boolean) {
    this.dir = dir;
    this.name = name;
    this.depth = depth;
    this.isDirectory = isDirectory;
    this.openFlg = openFlg;
    this.possessionFiles = [];
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileTreeService {
  treeWorkSpace: ITreeWorkSpace;
  possessionFiles: IPossessionFiles;
  constructor(private es: ElectronService) {
  }

  /**
   * ワークディレクトリを設定する。
   *
   * @param {string} dir
   * @memberof FileTreeService
   */
  setTreeRoot(dir: string) {
    console.log(dir);
    this.treeWorkSpace = new class implements ITreeWorkSpace {
      dir = '';
      possessionFiles = [];
    };
    this.treeWorkSpace.dir = dir;
    this.parseFileTree(this.treeWorkSpace);
    console.log(this.treeWorkSpace);
  }

  /**
   * ワークスペースを元にtree情報を作成する。
   *
   * @private
   * @param {ITreeWorkSpace} tws ワークスペースツリー情報
   * @memberof FileTreeService
   */
  private parseFileTree(tws: ITreeWorkSpace) {
    tws.possessionFiles = [];
    this._parseFileTree(tws.dir, tws.possessionFiles, 0);
  }

  /**
   * ツリー情報を作成する。(再帰処理)
   *
   * ツリー情報はソートされる。
   *  1. ディレクトリが上位
   *  2. 文字列順
   *
   * @private
   * @param {string} dir 対象ディレクトリ
   * @param {IPossessionFiles[]} possessionFiles 調査結果を格納するツリー情報
   * @param {number} depth ルートからの階層数
   * @memberof FileTreeService
   */
  private _parseFileTree(dir: string, possessionFiles: IPossessionFiles[], depth: number) {
    const names = this.es.fs.readdirSync(dir);
    for (let counter = 0; counter < names.length; counter++) {
      if (this.es.fs.statSync(dir + sep + names[counter]).isDirectory()) {
        possessionFiles.push(new PossessionFiles(dir, names[counter], depth + 1, true , false));
        // Todo: 7階層までサポートとしてみる。永久ループとか怖いしね。
        if (depth >= 7) {
          continue;
        }
        this._parseFileTree(dir + sep + names[counter], possessionFiles[counter].possessionFiles, depth + 1);
      } else {
        possessionFiles.push(new PossessionFiles(dir, names[counter], depth + 1, false , false));
      }
    }
    possessionFiles.sort((a, b) => {
      if (a.isDirectory === true && b.isDirectory === false) {
        return -1;
      }
      if (a.isDirectory === false && b.isDirectory === true) {
        return 1;
      }
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1;
      }
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

}
