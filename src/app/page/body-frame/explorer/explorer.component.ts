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
  constructor(private ed: ElectronDialogService, private fileTreeService: FileTreeService) { }

  debug() {
    this.ed.setWorkSpace();
  }

  ngAfterContentInit() {
    this.fileTreeService.$iTreeWorkSpaceSubject.subscribe(tree => {
      this.iTreeWorkSpace = tree;
      console.log(this.iTreeWorkSpace);
    });
  }

}
