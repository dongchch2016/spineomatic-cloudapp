import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { AlmaService } from '../services/alma.service';
import { PrintService } from '../services/print.service';
import { Item } from '../models/item';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { chunk } from 'lodash';
import { ConfigService } from '../services/config.service';
import { Config, Layout } from '../models/configuration';
import * as dot from 'dot-object';
import { NgxBarcodeComponent } from 'ngx-barcode';
import { itemExample } from '../models/item-example';

const INCH_IN_PIXELS = 96, CM_IN_PIXELS = 37.8, PREVIEW_WIDTH = 250;

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
})
export class PrintComponent implements OnInit {
  items = new Array<Array<Item>>();
  config: Config;
  @ViewChild(NgxBarcodeComponent)
  barcodeComponent: NgxBarcodeComponent;
  private itemsLoaded = 0;
  percentLoaded = 0;
  private _preview: Layout;
  @Input() set preview(val: Layout) {
    try {
      const scale = PREVIEW_WIDTH / (val.pageWidth * (val.measure == 'in' ? INCH_IN_PIXELS : CM_IN_PIXELS));
      let newval = {...val};
      ['topMargin', 'leftMargin', 'pageWidth', 'width', 'height', 'horizontalGap', 'verticalGap']
      .forEach(m=>newval[m]=newval[m]*scale);
      this._preview = newval;
      const perPage = (typeof this.layout.perPage == 'string') ? parseInt(this.layout.perPage) || 0 : this.layout.perPage;
      this.items = [new Array(perPage).fill(itemExample)];
    } catch(e) {
      console.warn('Could not display preview', e.message);
      this.items = [];
    }
  }

  constructor(
    public printService: PrintService,
    private alma: AlmaService,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }

  load() {
    return this.configService.get()
    .pipe(
      tap(config=>this.config = config),
      switchMap(()=>forkJoin(Array.from(this.printService.items).map(i=>this.getItem(i)))),
      tap(items => this.items = chunk(items, this.layout.perPage)),
      finalize(()=>{
        this.percentLoaded = 0; this.itemsLoaded = 0;
      }),
    )
  }

  getItem(link: string) {
    return this.alma.getItem(link).pipe(
      tap(()=>{
        this.itemsLoaded++
        this.percentLoaded = 
          Math.round((this.itemsLoaded/this.printService.items.size)*100);
      }),
      catchError(e => of(e)),
    )
  }

  get layout() {
    return this._preview || this.printService.layout;
  }

  get template() {
    return this.printService.template;
  }

  contents(item: Item) {
    if (this._preview) return '<p>X</p>';
    let body = this.printService.template.contents
    .replace(/{{ *(\S*:\S*) *}}/g, (match, str) => {
      const [ cmd, detail ] = str.split(':');
      if (cmd == 'image') {
        return this.getImage(detail);
      } else {
        const val = dot.pick(detail, item);
        switch (detail) {
          case 'item_data.barcode':
            return this.getBarCode(val);
          case 'item_data.alt_call_no':
          case 'item_data.call_no':
            return this.getCallNo(val);
          default:
            return val;
        }
      }
    })
    return this.sanitizer.bypassSecurityTrustHtml(body);
  }

  getBarCode(val: string) {
    if (!this.printService.template.asBarcode) return val; 
    this.barcodeComponent.value = val;
    this.barcodeComponent.bcElement.nativeElement.innerHTML = "";
    this.barcodeComponent.createBarcode();
    return this.barcodeComponent.bcElement.nativeElement.innerHTML;
  }

  getCallNo(val: string | Array<string>) {
    if (!val) return "";
    if (!Array.isArray(val)) return val;
    var splitId = "<br>";
    var returnstr = "";
    if (this.template.callNumberLineBreaks) {
      splitId = this.template.splitIdentifier;
      returnstr = val.join(' ').split(splitId).join("<br>");
    } else {
      returnstr = val.join(' ');
    }
    return returnstr;
  }

  getImage(key: string) {
    return this.config.images[key] 
      ? `<img src="${this.config.images[key].url}" style="max-height: ${this.printService.layout.height*.25}${this.printService.layout.measure}">`
      : '';  
  }
}
