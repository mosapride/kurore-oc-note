import { ElectronService } from './../../../core/services/electron/electron.service';
import { ActiveFileManagerService } from './../../../service/active-file-manager.service';
import { Component, OnInit } from '@angular/core';
import * as hljs from 'highlight.js';
import * as marked from 'marked';
import { sep } from 'path';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  html = '';  // 画面に表示するMarkdownからHTMLに変換した文字列
  constructor(
    private electronService: ElectronService,
    private activeFileManagerService: ActiveFileManagerService
  ) { }

  ngOnInit() {
    this.activeFileManagerService.$markdownContentsSubject.asObservable().subscribe(data => {
      // this.html = data;
      this.html = marked(data, new MarketOption(this.electronService, this.activeFileManagerService).getOption());
    });
  }

  onDragOver(evt: DragEvent) {
    console.log(evt);
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDragLeave(evt: DragEvent) {
    console.log(evt);
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDrop(evt: DragEvent) {
    console.log(evt);
    evt.preventDefault();
    evt.stopPropagation();
  }

}


class MarketOption {
  constructor(private electronService: ElectronService, private activeFileManagerService: ActiveFileManagerService) {
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
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `${head}<div class="highlight-code">${hljs.highlight(lang, str, true).value}</div></code></pre>`;
          } catch (err) {
            return `<pre><code><div class="highlight-code">${hljs.highlight(lang, str, true).value}</div></code></pre>`;
          }
        }
        return `<pre class="hljs highlight-padding"><div class="highlight-code">${hljs.highlightAuto(str).value}</div></pre>`;
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

      // ブラウザへのlink
      if (href.match(/^http/) || href.match('//')) {
        return `<a href="javascript:void(0)" title="${href}" alt="${href}" data-outerLink="${href}" target="_blank" class="external-link" title="${title}">${text}</a>`;
      }
      let cssClazzName = 'internal-link';
      let markfile = href.replace(/\//g, sep);
      markfile = this.activeFileManagerService.getPath() + sep + markfile;

      // markdown以外のアプリケーションリンク
      if (!markfile.match(/\.md$/)) {
        cssClazzName += ' external-app';
      }

      // アプリケーションリンクの存在有無
      if (!this.electronService.fs.statSync(markfile)) {
        cssClazzName += ' no-link';
      }
      // markdown内のlinkから、markdownファイルへのリンクまたはアプリケーションのリンクとして返す。
      return `<a href="javascript:void(0)" title="${href}" alt="${href}" data-inLink="${href}" class="${cssClazzName}">${text}</a>`;
    };
  }

  private addRenderImage(render : marked.Renderer) {
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
