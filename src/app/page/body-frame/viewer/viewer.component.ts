import { FileTreeService } from './../../../service/file-tree.service';
import { FileManagerService, EStatType } from './../../../service/file-manager.service';
import { ElectronService } from './../../../core/services/electron/electron.service';
import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { Component, OnInit, HostListener } from '@angular/core';
import * as hljs from 'highlight.js';
import * as marked from 'marked';
import { sep } from 'path';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  data = '';
  html = '';  // 画面に表示するMarkdownからHTMLに変換した文字列
  constructor(
    private electronService: ElectronService,
    private activeFileManagerService: ActiveFileManagerService,
    private fileManagerService: FileManagerService,
    private fileTreeService: FileTreeService,
  ) { }

  ngOnInit() {
    this.activeFileManagerService.$markdownContentsSubject.asObservable().subscribe(data => {
      this.data = data;
      this.html = marked(data, new MarketOption(this.activeFileManagerService, this.fileManagerService).getOption());
    });
  }


  /**
   * Viewerのclickイベント.
   *
   * * 内部linkの実装
   *
   * 内部リンクに関しては通常通りの通さを行うとパスがexe-rootからになり使用しにくくなる。
   * また、もしパスが合ってたとしてもアプリ全体がその指定されたページになり、仕様どおりの動作にならないため内部リンクをキャッチする。
   *
   * @param {*} event
   * @returns
   * @memberof ViewerComponent
   */
  @HostListener('click', ['$event']) onclick(event: MouseEvent) {
    let href = '';
    try {
      // 画像イメージの場合
      if (event.target['classList'].contains('set-lightbox')) {
        return;
      }

      href = event.target['dataset'].inlink;
      // 内部リンクではない場合
      if (!href) {
        href = event.target['dataset'].outerlink;
        event.preventDefault();
        event.stopPropagation();
        this.electronService.shell.openExternal(href);
        return;
      }
      href = href.replace(/\//g, sep);
      href = this.activeFileManagerService.getPath() + sep + href;
      // ファイルが存在しない場合。
      if (this.fileManagerService.getStatType(href) === EStatType.not_found) {
        this.activeFileManagerService.makeDirFile(href);
        this.html = marked(this.data, new MarketOption(this.activeFileManagerService, this.fileManagerService).getOption());
        return;
      }
      if (!href.match(/\.md$/)) {
        event.preventDefault();
        event.stopPropagation();
        this.electronService.shell.openItem(href);
        return;
      } else {
        const poss = this.fileTreeService.getPossessionFiles(href)
        if (poss) {
          this.activeFileManagerService.setActiveMd(poss);
          this.fileTreeService.openDirectory(poss);
        }
      }
    } catch (e) {
      return;
    }
  }


  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

}


class MarketOption {
  constructor(
    private activeFileManagerService: ActiveFileManagerService,
    private fileManagerService: FileManagerService,
  ) {
  }
  getOption(): marked.MarkedOptions {
    const option = this.highlightOption();
    option.renderer = this.markedRender();
    return option;
  }

  /**
   * markdownのコード記述をhighlight.jsに変更する.
   *
   * @private
   * @returns {marked.MarkedOptions}
   * @memberof MarketOption
   */
  private highlightOption(): marked.MarkedOptions {
    const marketOption: marked.MarkedOptions = {
      highlight: function (str, lang) {
        let head = '<pre class="hljs highlight-padding"><code class="highlight-padding">';
        let title = lang.split(':').length === 2 ? `<span class="highlight-title">${lang.split(':')[1]}</span>` : '';
        lang = lang.split(':').length === 2 ? lang.split(':')[0] : lang;
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `${head}<div class="highlight-code">${title}${hljs.highlight(lang, str, true).value}</div></code></pre>`;
          } catch (err) {
            return `<pre><code><div class="highlight-code">${title}${hljs.highlight(lang, str, true).value}</div></code></pre>`;
          }
        }
        return `<pre class="hljs highlight-padding"><div class="highlight-code">${title}${hljs.highlightAuto(str).value}</div></pre>`;
      }
    }
    return marketOption;
  }

  private markedRender(): marked.Renderer {
    const render = new marked.Renderer();
    this.addRenderLink(render);
    this.addRenderImage(render);
    return render;
  }

  private addRenderLink(render: marked.Renderer) {
    render.link = (href: string, title: string, text: string): string => {

      let markfile = href.replace(/\//g, sep);
      markfile = this.activeFileManagerService.getPath() + sep + markfile;

      // markdownファイルの場合
      if (markfile.match(/\.md$/)) {
        if (this.fileManagerService.isStatSync(markfile)) {
          // markdown内のlinkから、markdownファイルへのリンクまたはアプリケーションのリンクとして返す。
          return `<a href="javascript:void(0)" title="${href}" alt="${href}" data-inLink="${href}" >${text}</a>`;
        } else {
          return `<a href="javascript:void(0)" title="${href}" alt="${href}" data-inLink="${href}" class="no-link">${text}</a>`;
        }
      } else {
        return `<a href="javascript:void(0)" title="${href}" alt="${href}" data-outerLink="${href}" target="_blank" class="external-link" title="${title}">${text}</a>`;
      }
    };
  }

  private addRenderImage(render: marked.Renderer) {
    render.image = (href: string, title: string, text: string): string => {
      let optionCode = '';

      if (text.length === 0) {
        text = new Date().getTime() + '';
      }

      const option = href.replace(/^(.*)#/, '');
      if (option.match(/^[0-9]+$/)) {
        optionCode = option;
      }

      if (href.match(/^http/) || href.match('//')) {
        if (optionCode !== '') {
          return `<a href="${href}" data-lightbox="${text}"><img src="${href}" style="width : ${optionCode}px" class="set-lightbox"></a>`;
        }
        return `<image src="${href}" alt="${text}" />`;
      }
      if (sep === '\\') {
        href = href.replace(/\//, '\\');
      }

      if (optionCode !== '') {
        // tslint:disable-next-line:max-line-length
        return `<a href="${this.activeFileManagerService.getPath() + sep + href}" data-lightbox="${text}"><image src="${this.activeFileManagerService.getPath() + sep + href}" alt="${text}"  style="width : ${optionCode}px" class="set-lightbox" /></a>`;
      }
      return `<image src="${this.activeFileManagerService.getPath() + sep + href}" alt="${text}" />`;
    };
  }
}
