import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { tap } from 'rxjs';
import { IProduct } from '../../models/product.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'mc-products-list',
  imports: [
    DrawerModule,
    TableModule,
    SvgIconComponent,
    ButtonModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {

  public readonly columns = [
    { field: 'name', header: 'Name' },
    { field: 'producent', header: 'Producent' },
    { field: 'createdBy', header: 'Created by' },
  ];

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private productsSignal = signal<IProduct[]>([]);
  public products = this.productsSignal.asReadonly();

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.productsSignal.set(data['products'])),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public openProductPreview(productId: string) {
    this.router.navigate([`${this.router.url}/${productId}`]);
  }

  public addNewProduct() {
    this.router.navigate([`${this.router.url}/new`]);
    }
}
