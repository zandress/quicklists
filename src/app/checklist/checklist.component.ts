import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AlertController,
  IonContent,
  IonicModule,
  IonRouterOutlet,
} from '@ionic/angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { __param } from 'tslib';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { Checklist } from '../shared/interfaces/checklist';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItemListComponentModule } from './ui/checklist-item-list.component';

@Component({
  selector: 'app-checklist',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ion-header class="ion-no-border">
        <ion-toolbar color="success">
          <ion-buttons slot="start">
            <ion-back-button color="light" defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>
            {{ vm.checklist.title }}
          </ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="resetChecklistItems(vm.checklist.id)">
              <ion-icon name="refresh" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button (click)="formModalIsOpen$.next(true)">
              <ion-icon name="add" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <app-checklist-item-list
          [checklistItems]="vm.items"
          (toggle)="toggleChecklistItem($event)"
          (delete)="deleteChecklistItem($event)"
          (edit)="openEditModal($event)"
        ></app-checklist-item-list>
        <ion-modal
          [isOpen]="vm.formModalIsOpen"
          [canDismiss]="true"
          (ionModalDidDismiss)="
            checklistItemIdBeingEdited$.next(null); formModalIsOpen$.next(false)
          "
          [presentingElement]="routerOutlet.nativeEl"
        >
          <ng-template>
            <app-form-modal
              [title]="
                vm.checklistItemIdBeingEdited ? 'Edit item' : 'Create item'
              "
              [formGroup]="checklistItemForm"
              (save)="
                vm.checklistItemIdBeingEdited
                  ? editChecklistItem(vm.checklistItemIdBeingEdited)
                  : addChecklistItem(vm.checklist.id)
              "
            ></app-form-modal>
          </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  styles: [
    `
      ion-header {
        background-color: var(--ion-color-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  @ViewChild(IonContent) ionContent!: IonContent;

  checklistItemIdBeingEdited$ = new BehaviorSubject<string | null>(null);

  formModalIsOpen$ = new BehaviorSubject<boolean>(false);

  checklistItemForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  checklistAndItems$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest([
        this.checklistService
          .getChecklistById(params.get('id') as string)
          .pipe(filter((checklist): checklist is Checklist => !!checklist)),
        this.checklistItemService
          .getItemsByChecklistId(params.get('id') as string)
          .pipe(
            tap(() => setTimeout(() => this.ionContent.scrollToBottom(200), 0))
          ),
      ])
    )
  );

  vm$ = combineLatest([
    this.checklistAndItems$,
    this.formModalIsOpen$,
    this.checklistItemIdBeingEdited$,
  ]).pipe(
    map(
      ([[checklist, items], formModalIsOpen, checklistItemIdBeingEdited]) => ({
        checklist,
        items,
        formModalIsOpen,
        checklistItemIdBeingEdited,
      })
    )
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    public routerOutlet: IonRouterOutlet,
    private alertCtrl: AlertController
  ) {}

  addChecklistItem(checklistId: string) {
    this.checklistItemService.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }

  toggleChecklistItem(itemId: string) {
    this.checklistItemService.toggle(itemId);
  }

  resetChecklistItems(checklistId: string) {
    this.checklistItemService.reset(checklistId);
  }

  async deleteChecklistItem(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      subHeader: 'This will delete this item on this checklist',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'confirm-delete-button',
          role: 'destructive',
          handler: () => {
            this.checklistItemService.remove(id);
          },
        },
        {
          text: 'Cancel',
          cssClass: 'cancel-delete-button',
          role: 'cancel',
        },
      ],
    });

    alert.present();
  }

  editChecklistItem(checklistItemId: string) {
    this.checklistItemService.update(
      checklistItemId,
      this.checklistItemForm.getRawValue()
    );
  }

  openEditModal(checklistItem: ChecklistItem) {
    this.checklistItemForm.patchValue({
      title: checklistItem.title,
    });
    this.checklistItemIdBeingEdited$.next(checklistItem.id);
    this.formModalIsOpen$.next(true);
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
    FormModalComponentModule,
    ChecklistItemListComponentModule,
  ],
})
export class ChecklistComponentModule {}
