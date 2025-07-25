import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { DrawerModule } from 'primeng/drawer';
import { tap } from 'rxjs';
import { defaultProduct } from '../../models/default-product.model';
import { IUpdateProductDto } from '../../models/product-dto.model';
import { IProduct } from '../../models/product.model';
import { ProductEditComponent } from '../product-edit/product-edit.component';

@Component({
  selector: 'mc-product',
  imports: [
    DrawerModule,
    ProductEditComponent,
    SvgIconComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private productSignal = signal<IProduct>(defaultProduct);
  public product = this.productSignal.asReadonly();
  public togglePanel = signal(false);

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.productSignal.set(data['product'])),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public updateProduct(updatedProduct: IUpdateProductDto) {
    this.productSignal.update(() => updatedProduct);
    this.togglePanel.set(false);
  }
}
