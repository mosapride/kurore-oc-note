import { SaveDataService,  EJsonPropertySingleString } from './service/save-data.service';
import { FileTreeService } from './service/file-tree.service';
import { Component, AfterContentInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {


  constructor(
    public electronService: ElectronService,
    translate: TranslateService,
    private fileTreeService: FileTreeService,
    private saveDataService: SaveDataService,
  ) {
    translate.setDefaultLang('ja');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngAfterContentInit(): void {
    // const last = this.saveDataService.readJsonPropatry(EJsonPropertySingleString.lastWorkSpaceName);
    // if (last) {
    //   this.fileTreeService.setTreeRoot(last);
    // }
  }
}
