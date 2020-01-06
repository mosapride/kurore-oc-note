import { Component, OnInit, Input } from '@angular/core';
import { IPossessionFiles } from '../../../../service/file-tree.service';

@Component({
  selector: 'app-prossession-file',
  templateUrl: './prossession-file.component.html',
  styleUrls: ['./prossession-file.component.scss']
})
export class ProssessionFileComponent implements OnInit {

  @Input() file: IPossessionFiles;
  constructor() { }

  ngOnInit() {
  }


  clickEvent(file : IPossessionFiles) {
    console.log(file);
    if (file.isDirectory) {
      file.openFlg = !file.openFlg;
    }
    console.log(file.openFlg);
  }
}
