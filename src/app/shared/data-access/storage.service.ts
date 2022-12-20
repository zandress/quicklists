import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { from, Observable } from "rxjs";
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Checklist } from "../interfaces/checklist";
import { ChecklistItem } from "../interfaces/checklist-item";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #checklistHasLoaded = false;
  #checklistItemsHasLoaded = false;

  storage$ = from(this.ionicStorage.create()).pipe(shareReplay(1));

  loadChecklist$ = this.storage$;

  loadChecklistItems$ = this.storage$;

  constructor(private ionicStorage: Storage) {}

  saveChecklists(checklist: Checklist[]) {}

  saveChecklistItems(checklistItems: ChecklistItem[]) {}
}
