import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
    enableProdMode();
}

// for enterprise customers
LicenseManager.setLicenseKey("ag-Grid_Evaluation_License_Key_Not_for_Production_100Devs26_March_2018__MTUyMjAxODgwMDAwMA==e8f8bbc1ff5aff3ac920e42d0542b6c9");

platformBrowserDynamic().bootstrapModule(AppModule);

