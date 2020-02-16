import { ElectronService } from '../../../core/services/electron/electron.service';
import { SaveDataService, EJsonPropertyArray, EJsonPropertySingleString } from '../../../service/save-data.service';
import { Component, OnInit, HostListener, Input } from '@angular/core';


const theme: string[] = [
  'a11y-dark.css',
  'a11y-light.css',
  'agate.css',
  'an-old-hope.css',
  'androidstudio.css',
  'arduino-light.css',
  'arta.css',
  'ascetic.css',
  'atelier-cave-dark.css',
  'atelier-cave-light.css',
  'atelier-dune-dark.css',
  'atelier-dune-light.css',
  'atelier-estuary-dark.css',
  'atelier-estuary-light.css',
  'atelier-forest-dark.css',
  'atelier-forest-light.css',
  'atelier-heath-dark.css',
  'atelier-heath-light.css',
  'atelier-lakeside-dark.css',
  'atelier-lakeside-light.css',
  'atelier-plateau-dark.css',
  'atelier-plateau-light.css',
  'atelier-savanna-dark.css',
  'atelier-savanna-light.css',
  'atelier-seaside-dark.css',
  'atelier-seaside-light.css',
  'atelier-sulphurpool-dark.css',
  'atelier-sulphurpool-light.css',
  'atom-one-dark-reasonable.css',
  'atom-one-dark.css',
  'atom-one-light.css',
  'brown-paper.css',
  'brown-papersq.png',
  'codepen-embed.css',
  'color-brewer.css',
  'darcula.css',
  'dark.css',
  'darkula.css',
  'default.css',
  'docco.css',
  'dracula.css',
  'far.css',
  'foundation.css',
  'github-gist.css',
  'github.css',
  'gml.css',
  'googlecode.css',
  'gradient-dark.css',
  'grayscale.css',
  'gruvbox-dark.css',
  'gruvbox-light.css',
  'hopscotch.css',
  'hybrid.css',
  'idea.css',
  'ir-black.css',
  'isbl-editor-dark.css',
  'isbl-editor-light.css',
  'kimbie.dark.css',
  'kimbie.light.css',
  'lightfair.css',
  'magula.css',
  'mono-blue.css',
  'monokai-sublime.css',
  'monokai.css',
  'night-owl.css',
  'nord.css',
  'obsidian.css',
  'ocean.css',
  'paraiso-dark.css',
  'paraiso-light.css',
  'pojoaque.css',
  'pojoaque.jpg',
  'purebasic.css',
  'qtcreator_dark.css',
  'qtcreator_light.css',
  'railscasts.css',
  'rainbow.css',
  'routeros.css',
  'school-book.css',
  'school-book.png',
  'shades-of-purple.css',
  'solarized-dark.css',
  'solarized-light.css',
  'sunburst.css',
  'tomorrow-night-blue.css',
  'tomorrow-night-bright.css',
  'tomorrow-night-eighties.css',
  'tomorrow-night.css',
  'tomorrow.css',
  'vs.css',
  'vs2015.css',
  'xcode.css',
  'xt256.css',
  'zenburn.css',
];

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  /**
   * 当コンポーネントが表示されている状態で`Escape`を押した場合に終了させる。
   *
   * @param {KeyboardEvent} event
   * @memberof WorkHistoryComponent
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.showFlg && (event.key === 'Escape')) {
      this.showFlg = false;
    }
  }

  theme = theme;
  highlightTheme: string;
  showFlg = false;
  constructor(
    private saveDataService: SaveDataService,
    private electronService: ElectronService,
  ) { }

  ngOnInit() {
    const css = this.saveDataService.readJsonPropatry(EJsonPropertySingleString.hightlightTheme);
    if (css) {
      this.highlightTheme = css;
      document.getElementById('cs_highlight')['href'] = `assets/highlight.js/styles/${css}`;
    } else {
      this.highlightTheme = 'defalt.css';
    }
  }

  /**
   * 親要素へのクリックイベントの通知を止める。(画面が消えてしまうから)
   *
   * @param {MouseEvent} event
   * @memberof WorkHistoryComponent
   */
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public open() {
    this.showFlg = true;
  }

  changeTheme(css: string) {
    document.getElementById('cs_highlight')['href'] = `assets/highlight.js/styles/${css}`;
  }

  saveTheme(css: string) {
    this.saveDataService.writeJsonPropatry(EJsonPropertySingleString.hightlightTheme, css);
  }

}
