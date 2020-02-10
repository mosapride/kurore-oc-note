import { HistoryService } from './../../../service/history.service';
import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { sep } from 'path';
import { FileManagerService } from './../../../service/file-manager.service';
import { SaveDataService, EJsonPropertySingleString } from './../../../service/save-data.service';
import { FileTreeService, ITreeWorkSpace, IPossessionFiles } from './../../../service/file-tree.service';
import { ElectronDialogService } from './../../../service/electron-dialog.service';
import { Component, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss', './prossession-file/prossession-file.component.scss']
})
export class ExplorerComponent implements AfterContentInit {
  iTreeWorkSpace: ITreeWorkSpace;
  file: IPossessionFiles;
  newFileFlg = false;
  newFolderFlg = false;
  constructor(
    private ed: ElectronDialogService,
    private fileTreeService: FileTreeService,
    private saveDataService: SaveDataService,
    private fileManagerService: FileManagerService,
    private activeFileManagerService: ActiveFileManagerService,
    private historyService: HistoryService,
  ) { }

  open() {
    this.ed.setWorkSpace(() => {
      this.historyService.clearHistory();
      this.activeFileManagerService.editorClean();
    });
  }

  close() {
    this.fileTreeService.allCloseDirectory();
  }

  getDirName() {
    if (typeof this.iTreeWorkSpace === 'undefined') {
      return '';
    }
    let wkName = this.iTreeWorkSpace.dir.split(sep);
    return wkName[wkName.length - 1];
  }

  ngAfterContentInit() {
    this.fileTreeService.$iTreeWorkSpaceSubject.subscribe(tree => {
      this.iTreeWorkSpace = tree;
      this.file = new class implements IPossessionFiles {
        dir = '';  // ディレクトリ
        name = ''; // ファイル名
        depth = 0; // ワークスペースからの階層No
        isDirectory: boolean; // ディレクトリフラグ
        openFlg: boolean;  // ディレクトリ時のオープンフラング
        possessionFiles: IPossessionFiles[];  // 所持しているファイル一覧
      }
      const reg = new RegExp(this.getDirName() + '$');
      this.file.dir = this.iTreeWorkSpace.dir.replace(reg, '');
      this.file.name = this.getDirName();

    });
    const last = this.saveDataService.readJsonPropatry(EJsonPropertySingleString.lastWorkSpaceName);
    if (last) {
      if (this.fileManagerService.isDirectory(last)) {
        this.fileTreeService.setTreeRoot(last);
        if (this.fileManagerService.isFile(last + sep + 'index.md')) {
          const poss = this.fileTreeService.getPossessionFiles(last + sep + 'index.md');
          this.activeFileManagerService.setActiveMd(poss);
        }
      }
    }
  }

}
