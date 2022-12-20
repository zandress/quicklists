import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  RouterModule,
} from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { ChecklistItemService } from './checklist/data-access/checklist-item.service';
import { ChecklistService } from './shared/data-access/checklist.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService
  ) {}

  ngOnInit() {
    this.checklistService.load();
    this.checklistItemService.load();
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: 'home',
          loadChildren: () =>
            import('./home/home.component').then((m) => m.HomeComponentModule),
        },
        {
          path: 'checklist/:id',
          loadChildren: () =>
            import('./checklist/checklist.component').then(
              (m) => m.ChecklistComponentModule
            ),
        },
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full',
        },
      ],
      { preloadingStrategy: PreloadAllModules }
    ),
    IonicStorageModule.forRoot({
      driverOrder: [
        //eslint-disable-next-line no-underscore-dangle
        cordovaSQLiteDriver._driver,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
      ],
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
