import { ActiveFileManagerService } from './../../../../service/active-file-manager.service';
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { IPossessionFiles } from '../../../../service/file-tree.service';
import { sep } from 'path';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-prossession-file',
  templateUrl: './prossession-file.component.html',
  styleUrls: ['./prossession-file.component.scss']
})
export class ProssessionFileComponent {
  @ViewChild('item', { static: true }) item: ElementRef;
  @Input() file: IPossessionFiles;
  constructor(
    private activeFileManagerService: ActiveFileManagerService,
    private sanitizer: DomSanitizer
  ) { }

  isImage() {
    if (this.file.isDirectory) {
      return false;
    } else {
      if (this.file.name.match(/\.png$|\.gif$|\.jpeg$|\..jpg/)) {
        return true;
      }
    }
    return false;
  }

  getImageHref() {
    return this.sanitizer.bypassSecurityTrustUrl(this.file.dir + sep + this.file.name);
  }


  clickEvent(file: IPossessionFiles, event?: any) {
    if (file.isDirectory) {
      file.openFlg = !file.openFlg;
    }

    if (file.name.match(/\.md$/)) {
      this.activeFileManagerService.setActiveMd(file);
    }
  }

  isActive(file: IPossessionFiles) {
    return this.activeFileManagerService.compareActiveFile(file);
  }
}
