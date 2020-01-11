import { IPossessionFiles } from './../../../service/file-tree.service';
import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { Component, AfterContentInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as codetype from 'codemirror';
import { ElectronService } from '../../../core/services';


declare var CodeMirror: typeof codetype;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterContentInit {
  @ViewChild('codemirror', { static: true }) codemirror: ElementRef;
  codeInstance: codetype.EditorFromTextArea;
  markdownContents = ''; // markdownファイルの内容
  viewFileName = '';
  changeFlg = false;

  constructor(public es: ElectronService, private activeFileManagerService: ActiveFileManagerService) { }

  getChangeFlg(): string {
    if (this.activeFileManagerService.isMdContentChanged()) {
      return `*`;
    }
    return ``;
  }

  ngAfterContentInit() {
    this.initCodeMirror();
    this.initSubject();
  }

  initCodeMirror() {
    this.codeInstance = CodeMirror.fromTextArea(this.codemirror.nativeElement, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: false,
      value: this.markdownContents,
      // theme: this.selectedCodemirrortheme,
      viewportMargin: Infinity,
      extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList',
        'Ctrl-S': () => this.save()
      },
    });
    this.codeInstance.setSize('100%', '100%');
  }

  initSubject() {
    console.log(`initSubject`);

    this.activeFileManagerService.$activeFileSubject.asObservable().subscribe(pross  => {
      console.log(`initSubject subscribe`);
      this.codeInstance.getDoc().clearHistory();
      this.markdownContents = this.activeFileManagerService.readFileMd(pross);
      this.codeInstance.setValue(this.markdownContents);
      this.viewFileName = pross.name;
    });

    // this.activeFileManagerService.$activeFileSubject.subscribe(d => {
    //   console.log(`initSubject subscribe`);
    //   this.codeInstance.getDoc().clearHistory();
    //   this.markdownContents = this.activeFileManagerService.readFileMd(d);
    //   this.codeInstance.setValue(this.markdownContents);
    // });
  }



  private save() {

  }

}
