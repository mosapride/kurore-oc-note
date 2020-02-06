import { FileManagerService } from './../../../../service/file-manager.service';
import { ElectronService } from './../../../../core/services/electron/electron.service';
import { ActiveFileManagerService } from './../../../../service/active-file-manager.service';
import { Component, Input, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { IPossessionFiles, FileTreeService } from '../../../../service/file-tree.service';
import { sep, normalize } from 'path';
import { DomSanitizer } from '@angular/platform-browser';


enum FileType {
  directory,
  image,
  markdown,
  other
};

@Component({
  selector: 'app-prossession-file',
  templateUrl: './prossession-file.component.html',
  styleUrls: ['./prossession-file.component.scss']
})
export class ProssessionFileComponent {
  // @ViewChild('item', { static: true }) item: ElementRef;
  @ViewChild('rename', { static: false }) rename: ElementRef;
  @ViewChild('lightbox', { static: false }) lightbox: ElementRef;
  @Input() file: IPossessionFiles;
  newFolderFlg = false;
  newFileFlg = false;
  renameFlg = false;
  contextmenuFlg = false;
  constructor(
    private activeFileManagerService: ActiveFileManagerService,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private fileTreeService: FileTreeService,
  ) { }

  isImage() {
    if (this.file.isDirectory) {
      return false;
    } else {
      if (this.file.name.match(/\.png$|\.gif$|\.jpeg$|\..jpg$/)) {
        return true;
      }
    }
    return false;
  }


  getEnumFileType() {
    return FileType;
  }


  getFileType(): FileType {
    if (this.file.isDirectory) {
      return FileType.directory;
    }

    if (this.file.name.match(/\.png$|\.gif$|\.jpeg$|\..jpg$/)) {
      return FileType.image;
    }

    if (this.file.name.match(/\.md$/)) {
      return FileType.markdown;
    }

    return FileType.other;

  }

  copyName(event: DragEvent) {

    if (this.renameFlg) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const rootdir = normalize(this.fileTreeService.getITreeWorkSpaceDir());
    let targetdir = normalize(this.file.dir);
    targetdir = targetdir.replace(rootdir, '');
    const reg = RegExp(/\/|\\/, 'g');
    targetdir = targetdir.replace(reg, '/');
    targetdir = targetdir.replace(/^\//, '');
    const dep = this.activeFileManagerService.getActiveMd().depth;
    let depPath = '';
    for (let i = 1; i < dep; i++) {
      depPath = '../' + depPath;
    }
    event.dataTransfer.setData("text/plain", `![${this.file.name}](${depPath}${targetdir}/${this.file.name})`);
  }

  openLightbox(event) {
    if (this.renameFlg) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    let native = this.lightbox.nativeElement as HTMLElement;
    native.setAttribute(`href`, this.file.dir + sep + this.file.name);
    native.setAttribute(`data-lightbox`, `explorer`);
    native.setAttribute(`lightbox`, `explorer`);
    native.setAttribute(`rel`, `lightbox`);
  }

  getImageHref() {
    return this.sanitizer.bypassSecurityTrustUrl(this.file.dir + sep + this.file.name);
  }


  clickEvent(file: IPossessionFiles, event?: any) {
    if (file.isDirectory) {
      file.openFlg = !file.openFlg;
      return;
    }

    if (file.name.match(/\.md$/)) {
      this.activeFileManagerService.setActiveMd(file);
    } else {
      this.electronService.shell.openItem(normalize(file.dir + sep + file.name));
    }
  }

  isActive(file: IPossessionFiles) {
    return this.activeFileManagerService.compareActiveFile(file);
  }


  onRightClick(file: IPossessionFiles) {
    this.contextmenuFlg = true;
    if (file.isDirectory) {
      this.rightClickOnDirectory(file);
    } else {
      this.rightClickOnFile(file);
    }
    // this.contextmenuFlg = false;
  }

  /**
   * フォルダを右クリックしたときのイベント
   *
   * @private
   * @param {IPossessionFiles} file
   * @memberof ProssessionFileComponent
   */
  private rightClickOnDirectory(file: IPossessionFiles) {
    const menu = new this.electronService.remote.Menu();
    const menuItem = this.electronService.remote.MenuItem;
    menu.append(new menuItem({
      label: 'open explorer', click: () => {
        this.ngZone.run(() => {
          this.electronService.shell.showItemInFolder(normalize(file.dir + sep + file.name));
        });
      }
    }));
    menu.append(new menuItem({ type: 'separator' }));
    menu.append(new menuItem({
      label: 'new folder', click: () => {
        this.ngZone.run(() => {
          this.newFolderFlg = true;
          this.file.openFlg = true;
          // this.changeDetectorRef.detectChanges();
          // this.newFolder.nativeElement.focus();
        });
      }
    }));
    menu.append(new menuItem({
      label: 'new file', click: () => {
        this.ngZone.run(() => {
          this.newFileFlg = true;
          this.file.openFlg = true;
          // this.changeDetectorRef.detectChanges();
          // this.newFile.nativeElement.focus();
          // this.newFile.nativeElement.setSelectionRange(0, 8);
        });
      }
    }));
    menu.append(new menuItem({
      label: 'rename', click: () => {
        this.ngZone.run(() => {
          this.renameFlg = true;
          this.changeDetectorRef.detectChanges();
          this.rename.nativeElement.focus();
          this.rename.nativeElement.setSelectionRange(0, this.file.name.length);
        });
      }
    }));
    menu.append(new menuItem({ type: 'separator' }));
    menu.append(new menuItem({
      label: 'delete', click: () => {
        this.ngZone.run(() => {
          this.rm();
        });
      }
    }));
    menu.popup({
      window: this.electronService.remote.getCurrentWindow(), callback: () => {
        this.contextmenuFlg = false;
      }
    });
  }

  setRename(name: string) {
    const path = this.file.dir + sep;
    this.fileManagerService.renameSync(normalize(path + this.file.name), normalize(path + name));
    this.file.name = name;
    this.renameFlg = false;
  }

  rm() {
    this.fileManagerService.rmSync(normalize(normalize(this.file.dir + sep + this.file.name)));
  }

  private rightClickOnFile(file: IPossessionFiles) {
    const menu = new this.electronService.remote.Menu();
    const menuItem = this.electronService.remote.MenuItem;
    menu.append(new menuItem({
      label: 'open explorer', click: () => {
        this.ngZone.run(() => {
          this.electronService.shell.showItemInFolder(normalize(file.dir + sep + file.name));
        });
      }
    }));
    menu.append(new menuItem({ type: 'separator' }));
    menu.append(new menuItem({
      label: 'rename', click: () => {
        this.ngZone.run(() => {
          this.renameFlg = true;
          this.changeDetectorRef.detectChanges();
          this.rename.nativeElement.focus();
          let length = this.file.name.length
          if (this.file.name.split('.').length === 2) {
            length = length - this.file.name.split('.')[1].length - 1 ;
          }
          this.rename.nativeElement.setSelectionRange(0, length);
        });
      }
    }));
    menu.append(new menuItem({ type: 'separator' }));
    menu.append(new menuItem({
      label: 'delete', click: () => {
        this.ngZone.run(() => {
          this.rm();
        });
      }
    }));
    menu.popup({
      window: this.electronService.remote.getCurrentWindow(), callback: () => {
        this.contextmenuFlg = false;
      }
    });
  }
}
