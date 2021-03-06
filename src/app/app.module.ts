import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BodyFrameComponent } from './page/body-frame/body-frame.component';
import { ExplorerComponent } from './page/body-frame/explorer/explorer.component';
import { EditorComponent } from './page/body-frame/editor/editor.component';
import { ViewerComponent } from './page/body-frame/viewer/viewer.component';
import { SashComponent } from './page/ui/sash/sash.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { IconSvgDirective } from './directive/icon-svg.directive';
import { MenuComponent } from './page/menu/menu.component';
import { ProssessionFileComponent } from './page/body-frame/explorer/prossession-file/prossession-file.component';
import { IconComponent } from "./page/body-frame/explorer/prossession-file/icon/icon.component";
import { NoSanitizePipe } from './pipe/no-sanitize.pipe';
import { DatePipe } from '@angular/common';
import { NewDirfileComponent } from './page/body-frame/explorer/new-dirfile/new-dirfile.component';
import { SettingComponent } from './page/menu/setting/setting.component';
import { WorkHistoryComponent } from './page/menu/work-history/work-history.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, BodyFrameComponent, ExplorerComponent, EditorComponent, ViewerComponent, SashComponent, IconSvgDirective, MenuComponent, ProssessionFileComponent, IconComponent, NoSanitizePipe, NewDirfileComponent, SettingComponent, WorkHistoryComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
