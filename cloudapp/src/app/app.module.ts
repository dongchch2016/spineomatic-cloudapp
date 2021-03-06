import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MaterialModule, AlertModule } from '@exlibris/exl-cloudapp-angular-lib';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { NgxBarcodeModule } from 'ngx-barcode';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DialogModule } from './dialogs/dialog.module';
import { getTranslateModuleWithICU } from './utils';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './configuration/layout/layout.component';
import { TemplateComponent } from './configuration/template/template.component';
import { ImageComponent } from './configuration/image/image.component'; 
import { SelectEntitiesComponent } from './select-entities/select-entities.component';
import { SelectSetComponent } from './select-set/select-set.component';
import { LabelsComponent } from './labels/labels.component';
import { PrintComponent } from './print/print.component';
import { ConfigurationBaseComponent } from './configuration/configuration-base.component';

@NgModule({
  declarations: [					
    AppComponent,
    MainComponent,
    ConfigurationBaseComponent,
    ConfigurationComponent,
    LayoutComponent,
    TemplateComponent,
    ImageComponent,
    SelectEntitiesComponent,
    SelectSetComponent,
    LabelsComponent,
    PrintComponent,
   ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AlertModule,
    getTranslateModuleWithICU(),
    NgxBarcodeModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,    
    EditorModule,  
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { autoFocus: false } },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'assets/tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
