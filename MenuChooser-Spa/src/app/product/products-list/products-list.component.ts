import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { IProduct } from '../models/product.model';

@Component({
  selector: 'mc-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {

  public readonly columns = ['Name', 'Producent', 'CreatedBy'];

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private productsSignal = signal<IProduct[]>([]);
  public products = this.productsSignal.asReadonly();

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.productsSignal.set(data['products'])),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
