import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { ChecklistListComponentModule } from './ui/checklist-list.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title> Home </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="formModalIsOpen$.next(true)">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-checklist-list
        *ngIf="checklist$ | async as checklists"
        [checklists]="checklists"
        (delete)="deleteChecklist($event)"
        ></app-checklist-list>
      <ion-modal
        [isOpen]="formModalIsOpen$ | async"
        [canDismiss]="true"
        (ionModalDidDismiss)="formModalIsOpen$.next(false)"
      >
        <ng-template>
          <app-form-modal
            title="Create checklist"
            [formGroup]="checklistForm"
            (save)="addChecklist()"
          ></app-form-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
checklist$ = this.checklistService.getChecklists();

  formModalIsOpen$ = new BehaviorSubject<boolean>(false);

  checklistForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService
  ) {}

  addChecklist() {
    this.checklistService.add(this.checklistForm.getRawValue());
  }

  deleteChecklist(id: string) {
    this.checklistService.remove(id);
  }
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormModalComponentModule,
    ChecklistListComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
  declarations: [HomeComponent],
})
export class HomeComponentModule {}
