import { ElectronDialogService } from './../../../service/electron-dialog.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  constructor( private ed : ElectronDialogService) { }

  ngOnInit() {
  }

  debug() {
    this.ed.setWorkSpace();
  }

}
