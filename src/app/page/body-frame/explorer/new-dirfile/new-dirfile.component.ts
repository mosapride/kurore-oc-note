import { IPossessionFiles } from './../../../../service/file-tree.service';
import { Component, ElementRef, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FileManagerService } from '../../../../service/file-manager.service';
import { normalize, sep } from 'path';

@Component({
  selector: 'app-new-dirfile',
  templateUrl: './new-dirfile.component.html',
  styleUrls: ['../prossession-file/prossession-file.component.scss']
})
export class NewDirfileComponent {

  @ViewChild('newFolder', { static: false }) newFolder: ElementRef;
  @ViewChild('newFile', { static: false }) newFile: ElementRef;

  _newFolderFlg: boolean;
  _newFileFlg : boolean;
  @Input() set newFolderFlg(val : boolean) {
    this._newFolderFlg = val;
    if (this._newFolderFlg) {
      this.changeDetectorRef.detectChanges();
      this.newFolder.nativeElement.focus();
    }
  }
  @Output() newFolderFlgChange = new EventEmitter<boolean>();

  @Input() set newFileFlg (val : boolean) {
    this._newFileFlg = val;
    if (this._newFileFlg) {
      this.changeDetectorRef.detectChanges();
      this.newFile.nativeElement.focus();
      this.newFile.nativeElement.setSelectionRange(0, 8);
    }
  }

  @Output() newFileFlgChange = new EventEmitter<boolean>();

  clear() {
    this._newFolderFlg = false;
    this._newFileFlg = false;
    this.newFolderFlgChange.emit(false);
    this.newFileFlgChange.emit(false);
  }

  @Input() file: IPossessionFiles;

  constructor(
    private fileManagerService: FileManagerService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }



  /**
 * 新しいディレクトリを作成する
 *
 * @param {string} name 作成するディレクトリ名
 * @memberof ProssessionFileComponent
 */
  mkDir(name: string) {
    if (name.trim() === '') return;
    this.fileManagerService.mkdirSync(normalize(this.file.dir + sep + this.file.name + sep + name));
    this.clear();
  }

  mkFile(name: string) {
    if (name.trim() === '') return;
    this.fileManagerService.touchSync(normalize(this.file.dir + sep + this.file.name + sep + name))
    this.clear();

  }
}
