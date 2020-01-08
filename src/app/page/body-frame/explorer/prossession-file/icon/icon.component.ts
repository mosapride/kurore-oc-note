import { IPossessionFiles } from './../../../../../service/file-tree.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

const ICON_PATH = "assets/file-icon/";
const headers = new HttpHeaders();
headers.set('Accept', 'image/svg+xml');

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() isDirectory: boolean = false;
  @Input() openFlg: boolean = false;
  @Input() name: string = '';

  constructor(private el: ElementRef, private http: HttpClient) { }

  private getCloneIPossession(): IPossessionFiles {
    const file = new class IPossessionFiles {
      dir = '';
      name: string;
      depth: number;
      isDirectory: boolean;
      openFlg: boolean;
      possessionFiles: IPossessionFiles[];
    };

    file.isDirectory = this.isDirectory;
    file.openFlg = this.openFlg;
    file.name = this.name;
    return file;
  }

  ngOnInit(): void {
    this.el.nativeElement.style.display = 'inline-block';
    this.el.nativeElement.style.width = '18px';
    this.el.nativeElement.style.height = '18px';
    this.el.nativeElement.style.backgroundSize = 'cover';
    this.el.nativeElement.style.filter = 'contrast(100%)';
    this.el.nativeElement.style.verticalAlign = 'middle';

    this.changeImage(this.getCloneIPossession());
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.changeImage(this.getCloneIPossession());
  }

  changeImage(file: IPossessionFiles) {
    let img = this.getImageUrl(file);
    this.el.nativeElement.style.backgroundImage = `url(${img})`;
  }




  private getImageUrl(file: IPossessionFiles): string | undefined {
    if (file.isDirectory) {
      if (file.openFlg) {
        return `${ICON_PATH}default_folder_opened.svg`;
      }
      return `${ICON_PATH}default_folder.svg`;
    }
    const wk = file.name.split(".");
    if (wk.length === 1) {
      return `${ICON_PATH}default_file.svg`;
    }

    let ext = wk[wk.length - 1];
    // if (ext === 'md') ext = 'markdown';

    switch (ext.toLowerCase()) {
      case 'md' :
        break
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
        ext = 'image'
        break;
      default:
        ext = 'default_file'

    }

    return `${ICON_PATH}${ext}.svg`;

  }

  // private $setExtImageUrl(file: IPossessionFiles): Observable<string> {
  //   const wk = file.name.split(".");

  //   let ext = wk[wk.length - 1];
  //   // if (ext === 'md') ext = 'markdown';

  //   ext = `${ext}.svg`;
  //   return this.http.get(this.getExtSvgFileName(file), { headers, responseType: 'text' }).pipe(
  //     timeout(200),
  //     retry(1),
  //   );
  // }

  // private getExtSvgFileName(file: IPossessionFiles): string {
  //   const wk = file.name.split(".");

  //   let ext = wk[wk.length - 1];
  //   if (ext === 'md') ext = 'markdown';
  //   ext = `file_type_${ext}.svg`;
  //   return `${ICON_PATH}${ext}`;
  // }
}
