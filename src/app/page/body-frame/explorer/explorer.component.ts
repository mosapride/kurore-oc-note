import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { sep } from 'path';
import { FileManagerService } from './../../../service/file-manager.service';
import { SaveDataService, EJsonPropertySingleString } from './../../../service/save-data.service';
import { FileTreeService, ITreeWorkSpace } from './../../../service/file-tree.service';
import { ElectronDialogService } from './../../../service/electron-dialog.service';
import { Component, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements AfterContentInit {
  iTreeWorkSpace: ITreeWorkSpace;
  constructor(
    private ed: ElectronDialogService,
    private fileTreeService: FileTreeService,
    private saveDataService: SaveDataService,
    private fileManagerService: FileManagerService,
    private activeFileManagerService: ActiveFileManagerService,
  ) { }

  open() {
    this.ed.setWorkSpace();
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
    });
    const last = this.saveDataService.readJsonPropatry(EJsonPropertySingleString.lastWorkSpaceName);
    if (last) {
      if (this.fileManagerService.isDirectory(last)) {
        this.fileTreeService.setTreeRoot(last);
        console.log(`debug`);
        if (this.fileManagerService.isFile(last + sep + 'index.md')) {
          const poss = this.fileTreeService.getPossessionFiles(last + sep + 'index.md');
          this.activeFileManagerService.setActiveMd(poss);
        }
      }
    }
  }

}
