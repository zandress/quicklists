import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-checklist',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Checklist</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content> </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  constructor(private route: ActivatedRoute) {}
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChecklistComponent,
      },
    ]),
  ],
  declarations: [ChecklistComponent],
})
export class ChecklistComponentModule {}
