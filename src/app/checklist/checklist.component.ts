import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { __param } from 'tslib';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { FormModalComponentModule } from "../shared/ui/form-modal.component";
import { ChecklistItemService } from './data-access/checklist-item.service';

@Component({
  selector: 'app-checklist',
  template: `
    <ng-container
      *ngIf="{
        checklist: (checklist$ | async)!,
        formModalIsOpen: (formModalIsOpen$ | async)!
      } as vm"
    >
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>
            {{ vm.checklist.title }}
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-modal
          [isOpen]="vm.formModalIsOpen"
          [canDismiss]="true"
          (ionModalDidDismiss)="formModalIsOpen$.next(false)"
        >
          <ng-template>
            <app-form-modal
              title="Create item"
              [formGroup]="checklistItemForm"
              (save)="addChecklistItem(vm.checklist.id)"
            ></app-form-modal>
          </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);

  checklistItemForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  checklist$ = this.route.paramMap.pipe(
    switchMap((paramMap) =>
      this.checklistService.getChecklistById(paramMap.get('id') as string)
    )
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
  ) {}

  addChecklistItem(checklistId: string) {
    this.checklistItemService.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }
}

@NgModule({
    declarations: [ChecklistComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ChecklistComponent,
            },
        ]),
        FormModalComponentModule
    ]
})
export class ChecklistComponentModule {}
