import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { Component,  ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import * as codetype from 'codemirror';
import { ElectronService } from '../../../core/services';


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

  constructor(public es: ElectronService, private activeFileManagerService: ActiveFileManagerService) { }

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
        'Ctrl-S': () => this.save()
      },
    });
    this.codeInstance.setSize('100%', '100%');
    this.codeInstance.on('change', (ins: codetype.Editor, changeObj: codetype.EditorChangeLinkedList) => this.onChangeTextArea(ins, changeObj));
  }

  initSubject() {
    this.activeFileManagerService.$activeFileSubject.asObservable().subscribe(pross => {
      const markdownContents = this.activeFileManagerService.readFileMd(pross);
      this.codeInstance.getDoc().clearHistory();
      this.codeInstance.setValue(markdownContents);
      this.activeFileManagerService.setMdContentChange(this.codeInstance.getValue(), true);
      this.viewFileName = pross.name;
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
