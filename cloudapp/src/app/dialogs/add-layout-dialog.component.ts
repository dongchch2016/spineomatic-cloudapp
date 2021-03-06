import { ElementRef, Inject, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";
import { startCase } from "lodash";
import { LayoutExamples } from "../models/layout-examples";
import { DEFAULT_DIALOG_OPTIONS } from "./dialog";
import { PromptDialog, PromptDialogData } from "./prompt.component";

export interface AddLayoutDialogResult {
  name: string;
  basedOn: string;
}
@Component({
  selector: 'add-layout-dialog',
  template: `<h2 mat-dialog-title translate>{{data.title}}</h2>
  <mat-dialog-content>
    <p *ngIf="text">{{text}}</p>
    <mat-form-field>
      <mat-label>{{'Configuration.Layouts.ExampleLayout' | translate }}</mat-label>
      <mat-select [(ngModel)]="result.basedOn">
        <mat-option selected value="">{{'Blank' | translate}}</mat-option>
        <mat-option *ngFor="let layout of layoutExamples | keyvalue" [value]="layout.key">{{startCase(layout.key)}}</mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field>
      <mat-label>{{data.prompt | translate}}</mat-label>
      <input matInput #input [(ngModel)]="result.name" 
        (keyup.enter)="dialogRef.close(result)" 
      >
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-flat-button color="secondary" *ngIf="data.type=='ok-cancel'" mat-dialog-close>{{data.cancel | translate}}</button>
    <button mat-flat-button color="secondary" [mat-dialog-close]="result" cdkFocusInitial>{{data.ok | translate}}</button>
  </mat-dialog-actions>`,
  styles: [
    '.mat-form-field { display: block; }'
  ]
})
export class AddLayoutDialog extends PromptDialog {
  layoutExamples = LayoutExamples;
  startCase = startCase;
  @ViewChild('input') inputElement: ElementRef;
  defaultOptions: PromptDialogData = 
    Object.assign(DEFAULT_DIALOG_OPTIONS, { prompt: '', val: '' });
  result: AddLayoutDialogResult = { name: "", basedOn: ""};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Partial<PromptDialogData>,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<PromptDialog>
  ) {
    super(data,translate,dialogRef);
  }

  onNgInit() {
    this.result = { basedOn: "", name: this.data.val };
  }

  ngAfterViewInit() {
    setTimeout(()=>this.inputElement.nativeElement.focus());
  }
}