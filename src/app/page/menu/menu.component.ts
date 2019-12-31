import { Component, OnInit } from '@angular/core';
import { ElectronDialogService } from '../../service/electron-dialog.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private ed: ElectronDialogService) { }

  ngOnInit() {
  }

  open() {
    this.ed.setWorkSpace();
  }
}
