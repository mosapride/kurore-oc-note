import { FileManagerService } from './../../../service/file-manager.service';
import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as codetype from 'codemirror';
import { ElectronService } from '../../../core/services';
import { DatePipe } from '@angular/common';
import { sep } from 'path';


declare var CodeMirror: typeof codetype;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('codemirror', { static: true }) codemirror: ElementRef;
  codeInstance: codetype.EditorFromTextArea;
  viewFileName = '';
  changeFlg = false;
  timeoutInstance: NodeJS.Timer = null;

  constructor(
    public electronService: ElectronService,
    private activeFileManagerService: ActiveFileManagerService,
    private datePipe: DatePipe,
    private fileManagerService: FileManagerService,
  ) { }

  getChangeFlg(): string {
    if (this.activeFileManagerService.isMdContentChanged()) {
      return `*`;
    }
    return ``;
  }

  ngOnInit(): void {
    this.initCodeMirror();
    this.initSubject();
  }

  initCodeMirror() {
    this.codeInstance = CodeMirror.fromTextArea(this.codemirror.nativeElement, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: false,
      value: ``,
      viewportMargin: 10,
      extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList',
        'Ctrl-S': () => this.save(),

      },
    });
    this.codeInstance.setSize('100%', '100%');
    this.codeInstance.on('change', (ins: codetype.Editor, changeObj: codetype.EditorChangeLinkedList) => {
      this.onChangeTextArea(ins, changeObj)
    });
    this.codeInstance.on('focus', (instance) => {
      instance.refresh();
    });

    this.codeInstance.setOption('theme' , 'default');

    this.codeInstance.on('paste', (instance) => {
      const ctype = this.electronService.clipboard.availableFormats();
      let rtnFlg = true;
      for (const c of ctype) {
        if (c.match(/image/)) {
          rtnFlg = false;
          break;
        }
      }
      if (rtnFlg) {
        return;
      }

      if (typeof this.activeFileManagerService.getActiveMd() === 'undefined') {
        return;
      }
      const imgName = this.datePipe.transform(new Date(), 'MMddhhmmss') + '.png';
      this.electronService.fs.writeFile(this.activeFileManagerService.getPath() + sep + imgName, this.electronService.clipboard.readImage().toPNG(), () => {
        this.codeInstance.getDoc().replaceSelection(`![${imgName}](./${imgName})`);
        this.activeFileManagerService.setMdContentChange(this.codeInstance.getValue());
      });
    });
    this.codeInstance.on('drop', (instance, event) => {
      if (!this.activeFileManagerService.getActiveMd()) {
        return;
      }
      try {
        if (event.dataTransfer.files[0].type.match(/png|gif|jpeg|jpg|bmp/)) {
          const name = event.dataTransfer.files[0].name;
          const path = event.dataTransfer.files[0].path;
          this.fileManagerService.copy(path, this.activeFileManagerService.getPath() + sep + name, () => {
            instance.getDoc().replaceRange(`![${name}](./${name})`, instance.getCursor());
            this.activeFileManagerService.setMdContentChange(this.codeInstance.getValue());
          });
        }
      } catch (e) {
        return;
      }
    });
  }

  initSubject() {
    this.activeFileManagerService.$activeFileSubject.asObservable().subscribe(pross => {
      let markdownContents: string;
      try {
        markdownContents = this.activeFileManagerService.readFileMd(pross);
      } catch (e) {
        return;
      }
      this.codeInstance.getDoc().clearHistory();
      this.codeInstance.setValue(markdownContents);
      this.activeFileManagerService.setMdContentChange(this.codeInstance.getValue(), true);
      this.viewFileName = pross.name;
    });

    this.activeFileManagerService.$editorCleanSubject.asObservable().subscribe(() => {
      this.codeInstance.getDoc().clearHistory();
      this.codeInstance.setValue('');
    });
  }



  private save() {
    this.activeFileManagerService.ctrlS(this.codeInstance.getValue());
  }

  /**
   * makdownが変更された場合、viewerに反映させるために通知を出す.
   *
   * @private
   * @memberof MarkdownComponent
   */
  private onChangeTextArea(ins: codetype.Editor, changeObj: codetype.EditorChangeLinkedList): void {
    if (this.timeoutInstance !== null) {
      clearInterval(this.timeoutInstance);
      this.timeoutInstance = null;
    }
    this.timeoutInstance = setTimeout(() => {
      if (changeObj.origin !== 'setValue') {
        this.activeFileManagerService.setMdContentChange(this.codeInstance.getValue());
      }
      this.timeoutInstance = null;
    }, 200);
  }

}
