/* -------------------------------------------------------------------------------
 * ファイルツリーサービス.
 *
 * エクスプロラーに必要なディレクトリ・ファイルツリー情報を管理する
 * -------------------------------------------------------------------------------*/

import { sep, win32, dirname, normalize } from 'path';
import { Injectable } from '@angular/core';
import { ElectronService } from '../core/services';
import { FSWatcher } from 'fs';
import { Subject } from 'rxjs';

/**
 * ワークスペース管理.
 *
 * @export
 * @interface ITreeWorkSpace
 */
export interface ITreeWorkSpace {
  dir: string; // ワークスペースディレクトリ
  possessionFiles: IPossessionFiles[]; // 所持しているファイル一覧
}

/**
 * 所持ディレクトリ情報.
 *
 * @export
 * @interface IPossessionFiles
 */
export interface IPossessionFiles {
  dir: string;  // ディレクトリ
  name: string; // ファイル名
  depth: number; // ワークスペースからの階層No
  isDirectory: boolean; // ディレクトリフラグ
  openFlg: boolean;  // ディレクトリ時のオープンフラング
  possessionFiles: IPossessionFiles[];  // 所持しているファイル一覧
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
  $iTreeWorkSpaceSubject: Subject<ITreeWorkSpace>;
  fsWatcher: FSWatcher;
  prcFS: PrcFS;
  constructor(private es: ElectronService) {
    this.prcFS = new PrcFS(this.es);
    this.$iTreeWorkSpaceSubject = new Subject<ITreeWorkSpace>();
  }


  /**
   * フルパスからPossessionFilesを取得する。
   *
   * @param {string} href markdownまでのフルパス
   * @returns {PossessionFiles}
   * @memberof FileTreeService
   */
  getPossessionFiles(href: string): PossessionFiles {
    const dir = normalize(dirname(href));
    let name = win32.basename(href);
    return this.search(dir, name, this.treeWorkSpace.possessionFiles);
  }

  private search(dir: string, name: string, possessionFiles: PossessionFiles[]): IPossessionFiles | undefined {
    for (let p of possessionFiles) {
      if (p.dir === dir && p.name === name) {
        return p;
      }

      let rtn = this.search(dir, name, p.possessionFiles);
      if (rtn !== undefined) {
        return rtn;
      }
    }
    return undefined;
  }

  /**
   * ワークディレクトリを設定する。
   *
   * 下記機能を提供を行う。
   *
   * * `$iTreeWorkSpaceSubject`によるtree情報の通知
   * * ワークディレクトリ更新監視
   *
   * @param {string} dir ワークディレクトリ
   * @memberof FileTreeService
   */
  public setTreeRoot(dir: string) {
    this.treeWorkSpace = new class implements ITreeWorkSpace {
      dir = '';
      possessionFiles = [];
    };
    this.treeWorkSpace.dir = dir;
    this.parseFileTree(this.treeWorkSpace);
    this.fsWatch$(this.treeWorkSpace);
  }

  /**
   * ワークスペースを元にtree情報を作成する.
   *
   * 作成したtree情報は`$iTreeWorkSpaceSubject`により通達を行う。
   *
   * @private
   * @param {ITreeWorkSpace} tws ワークスペースツリー情報
   * @memberof FileTreeService
   */
  private parseFileTree(tws: ITreeWorkSpace) {
    tws.possessionFiles = [];
    this.prcFS.parseFileTree(tws.dir, tws.possessionFiles, 0);
    this.$iTreeWorkSpaceSubject.next(tws);
  }


  /**
   * 非同期でワーススペースの変更監視を行う。
   *
   * すでに監視済みの場合は、現在監視済みのワークスペースを解除し、新しく設定されたワークスペースの監視を行う。(多重起動なし)
   * 変更が行われた場合は引数`ITreeWorkSpace`のツリー情報を更新を行う。
   *
   * @private
   * @param {ITreeWorkSpace} tws 監視対象ワークスペース情報
   * @memberof FileTreeService
   */
  private fsWatch$(tws: ITreeWorkSpace): void {
    if (this.fsWatcher) {
      this.fsWatcher.close();
    }

    this.fsWatcher = this.es.fs.watch(tws.dir, { persistent: true, recursive: true }, (event, filename) => {
      if (event === 'change') {
        if (filename !== 'style.css') {
          return;
        }
      }

      this.prcFS.reloadWorkDirectory(this.treeWorkSpace.dir, this.treeWorkSpace, 0, tree => {
        this.treeWorkSpace = tree;
        this.$iTreeWorkSpaceSubject.next(this.treeWorkSpace);
      });
    });
  }

}

/**
 * 処理部.
 *
 * @class PrcFS
 */
class PrcFS {
  constructor(private es: ElectronService) { }

  /**
   * ファイルの存在有無.
   *
   * @param fullPath フルパス
   * @return true:存在する/false:存在しない
   */
  public isStatFile(fullPath: string): boolean {
    try {
      if (this.es.fs.statSync(fullPath).isFile()) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  /**
   * ツリー情報を作成する。(再帰処理).
   *
   * dirからツリー情報を
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
  public parseFileTree(dir: string, possessionFiles: IPossessionFiles[], depth: number) {
    const names = this.es.fs.readdirSync(dir);
    for (let counter = 0; counter < names.length; counter++) {
      if (this.es.fs.statSync(dir + sep + names[counter]).isDirectory()) {
        possessionFiles.push(new PossessionFiles(dir, names[counter], depth + 1, true, false));
        // Todo: 7階層までサポートとしてみる。永久ループとか怖いしね。
        if (depth >= 7) {
          continue;
        }
        this.parseFileTree(dir + sep + names[counter], possessionFiles[counter].possessionFiles, depth + 1);
      } else {
        possessionFiles.push(new PossessionFiles(dir, names[counter], depth + 1, false, false));
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

  /**
   * ワークスペースの再ロードを行う.
   *
   * 監視対象のファイル・ディレクトリの変更が行われたときに使用する。
   *
   * フォルダが`IPossessionFiles.openFlg`が`true`の状態は保持する。
   *
   * @param {string} workDirectory 監視ディレクトリ
   * @param {ITreeWorkSpace} oldTreeExplorer 現行のディレクトリ情報
   * @param {number} searchedDrectoryCnt 階層番号(初期値0)
   * @param {(tree: ITreeWorkSpace) => void} callback 変更された情報を返す。
   * @returns {void}
   * @memberof PrcFS
   */
  public reloadWorkDirectory(workDirectory: string, oldTreeExplorer: ITreeWorkSpace, searchedDrectoryCnt: number, callback: (tree: ITreeWorkSpace) => void): void {
    if (!oldTreeExplorer) {
      return;
    }

    var treeWorkSpace = new class implements ITreeWorkSpace {
      dir = workDirectory;
      possessionFiles = [];
    };
    this.parseFileTree(treeWorkSpace.dir, treeWorkSpace.possessionFiles, searchedDrectoryCnt);
    const openFileList = this.getOpenDirectoryList(oldTreeExplorer);
    for (const tree of treeWorkSpace.possessionFiles) {
      this._reloadWorkDrectory(openFileList, tree);
    }
    callback(treeWorkSpace);
  }

  private _reloadWorkDrectory(openFileList: Array<string>, file: IPossessionFiles) {
    for (const f of openFileList) {
      if (f === (file.dir + file.name)) {
        file.openFlg = true;
      }
    }
    for (const c of file.possessionFiles) {
      this._reloadWorkDrectory(openFileList, c);
    }
  }

  private getOpenDirectoryList(exp: ITreeWorkSpace): Array<string> {
    const rtnArray = [];
    for (const t of exp.possessionFiles) {
      this._getOpenDirectoryList(rtnArray, t);
    }
    return rtnArray;
  }

  private _getOpenDirectoryList(fullPathList: Array<string>, file: IPossessionFiles): void {
    if (file.openFlg) {
      fullPathList.push(file.dir + file.name);
    }
    for (const child of file.possessionFiles) {
      this._getOpenDirectoryList(fullPathList, child);
    }
  }

}
