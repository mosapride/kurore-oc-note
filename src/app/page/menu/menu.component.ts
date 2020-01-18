import { Component } from '@angular/core';
import { ElectronDialogService } from '../../service/electron-dialog.service';
import { ActiveFileManagerService } from '../../service/active-file-manager.service';

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

  styleSave(): boolean {
    return !this.activeFileManagerService.isMdContentChanged();
  }

  save() {
    if (this.activeFileManagerService.isMdContentChanged()) {
      this.activeFileManagerService.save();
    }
  }

  open() {
    this.electronDialogService.setWorkSpace();
  }

  debug() {
    this.electronDialogService.showFileSaveDialog(this.activeFileManagerService.getActiveMd());
  }
}
