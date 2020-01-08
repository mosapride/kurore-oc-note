import { ActiveFileManagerService } from './../../../../service/active-file-manager.service';
import { Component, OnInit, Input } from '@angular/core';
import { IPossessionFiles } from '../../../../service/file-tree.service';

@Component({
  selector: 'app-prossession-file',
  templateUrl: './prossession-file.component.html',
  styleUrls: ['./prossession-file.component.scss']
})
export class ProssessionFileComponent implements OnInit {

  @Input() file: IPossessionFiles;
  constructor(private afm: ActiveFileManagerService) { }

  ngOnInit() {
  }


  clickEvent(file: IPossessionFiles) {
    if (file.isDirectory) {
      file.openFlg = !file.openFlg;
    }

    this.afm.setActiveFile(file);
  }
}
