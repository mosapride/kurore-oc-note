import { Component, OnInit } from '@angular/core';
import { ElectronDialogService } from '../../service/electron-dialog.service';
import { ActiveFileManagerService } from '../../service/active-file-manager.service';
import { FileTreeService } from '../../service/file-tree.service';
import { SaveDataService, EJsonPropertySingleString } from '../../service/save-data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(
    private electronDialogService: ElectronDialogService,
    private activeFileManagerService: ActiveFileManagerService,
  ) { }


  open() {
    this.electronDialogService.setWorkSpace();
  }

  debug() {
    this.electronDialogService.showFileSaveDialog(this.activeFileManagerService.getActiveMd());
  }
}
