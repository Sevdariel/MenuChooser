import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { IProduct } from '../../models/product.model';

@Component({
    selector: 'mc-products-list',
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
    standalone: false
})
export class ProductsListComponent implements OnInit {

  public readonly columns = ['Name', 'Producent', 'CreatedBy'];

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
}
