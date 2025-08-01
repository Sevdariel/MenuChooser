import { Injectable, signal } from '@angular/core';
import { DrawerContent } from './drawer.model';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  public drawerVisible = signal<boolean>(false);

  private contentVisibleSignal = signal<DrawerContent>(DrawerContent.None);
  public contentVisible = this.contentVisibleSignal.asReadonly();

  public toggleDrawerPannel(contentVisible: DrawerContent) {
    this.drawerVisible.update((value) => !value);
    this.contentVisibleSignal.set(contentVisible);
  }
}
