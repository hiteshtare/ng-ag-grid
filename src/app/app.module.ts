import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import "ag-grid-enterprise";
import { AgGridModule } from "ag-grid-angular";
import { AppComponent } from "./app.component";
import { DateComponent } from "./features-grid/date-component/date.component";
import { HeaderComponent } from "./features-grid/header-component/header.component";
import { HeaderGroupComponent } from "./features-grid/header-group-component/header-group.component";

import { HttpModule } from '@angular/http';
import { DemoComponent } from './features-grid/demo/demo.component';
import { RequiredComponent } from './testing/required/required.component';
import { DetailCellRendererComponent } from './testing/detail-cell-renderer/detail-cell-renderer.component';
import { TreeStructComponent } from './testing/tree-struct/tree-struct.component';


@NgModule({
    declarations: [
        AppComponent,
        DateComponent,
        HeaderComponent,
        HeaderGroupComponent,
        DemoComponent,
        RequiredComponent,
        DetailCellRendererComponent,
        TreeStructComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
        HttpModule,
        AgGridModule.withComponents([
            DateComponent,
            HeaderComponent,
            HeaderGroupComponent,
            DetailCellRendererComponent
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
