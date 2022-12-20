import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Checklist } from 'src/app/shared/interfaces/checklist';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <ion-list lines="none">
      <ion-item-sliding
        side="end"
        *ngFor="let item of checklistItems; trackBy: trackByFn"
      >
        <ion-item (click)="toggle.emit(item.id)">
          <ion-label>{{ item.title }}</ion-label>
          <ion-checkbox
            color="light"
            slot="end"
            [checked]="item.checked"
          ></ion-checkbox>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="light" (click)="edit.emit(item)">
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option color="danger" (click)="delete.emit(item.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistItemListComponent {
  @Input() checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<ChecklistItem>();

  trackByFn(index: number, item: ChecklistItem) {
    return item.id;
  }
}
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ChecklistItemListComponent],
  exports: [ChecklistItemListComponent],
})
export class ChecklistItemListComponentModule {}
