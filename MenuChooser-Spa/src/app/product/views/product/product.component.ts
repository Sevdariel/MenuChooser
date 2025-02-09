import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { defaultProduct } from '../../models/default-product.model';
import { IProduct } from '../../models/product.model';

@Component({
  selector: 'mc-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private productSignal = signal<IProduct>(defaultProduct);
  public product = this.productSignal.asReadonly();

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.productSignal.set(data['product'])),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public edit() {
    
  }
}
