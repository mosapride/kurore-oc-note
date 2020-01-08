import { Component, OnInit } from '@angular/core';
import { ElectronDialogService } from '../../service/electron-dialog.service';
import { ActiveFileManagerService } from '../../service/active-file-manager.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private ed: ElectronDialogService , private afs :ActiveFileManagerService) { }

  ngOnInit() {
  }

  open() {
    this.ed.setWorkSpace();
  }

  debug() {
    this.ed.showFileSaveDialog(this.afs.getActiveFile());
  }
}
