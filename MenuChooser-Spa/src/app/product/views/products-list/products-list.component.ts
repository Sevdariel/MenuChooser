import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { tap } from 'rxjs';
import { IProduct, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'mc-products-list',
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
  public readonly ProductCategory = ProductCategory;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private allProductsSignal = signal<IProduct[]>([]);
  public searchQuery = signal<string>('');
  public activeCategory = signal<ProductCategory | 'all'>('all');
  public sortBy = signal<string>('name');

  public products = this.allProductsSignal.asReadonly();

  // Category metadata from mockup
  public readonly categoryMeta = {
    all: { label: 'Wszystkie', emoji: '📦', chipCls: 'chip-active' },
    [ProductCategory.VEGETABLES]: { label: 'Warzywa i owoce', emoji: '🥦', badgeCls: 'badge-vegs', chipCls: 'chip-vegs' },
    [ProductCategory.MEAT]: { label: 'Mięso i ryby', emoji: '🥩', badgeCls: 'badge-meat', chipCls: 'chip-meat' },
    [ProductCategory.DAIRY]: { label: 'Nabiał', emoji: '🥛', badgeCls: 'badge-dairy', chipCls: 'chip-dairy' },
    [ProductCategory.GRAINS]: { label: 'Produkty zbożowe', emoji: '🌾', badgeCls: 'badge-grains', chipCls: 'chip-grains' },
    [ProductCategory.OTHER]: { label: 'Inne', emoji: '📦', badgeCls: 'badge-other', chipCls: 'chip-other' },
  };

  // Sort options
  public readonly sortOptions = [
    { label: 'Sortuj: A–Z', value: 'name' },
    { label: 'Sortuj: Kcal', value: 'kcal' },
    { label: 'Sortuj: Białko', value: 'protein' },
    { label: 'Sortuj: Węglowodany', value: 'carbs' },
    { label: 'Sortuj: Tłuszcze', value: 'fat' },
  ];

  // Computed filtered and sorted products
  public filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.activeCategory();
    const sort = this.sortBy();

    let filtered = this.allProductsSignal().filter(p => {
      const matchCat = category === 'all' || p.category === category;
      const matchText = p.name.toLowerCase().includes(query) || p.sub.toLowerCase().includes(query);
      return matchCat && matchText;
    });

    // Sort
    if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'kcal') {
      filtered.sort((a, b) => b.kcal - a.kcal);
    } else if (sort === 'protein') {
      filtered.sort((a, b) => b.protein - a.protein);
    } else if (sort === 'carbs') {
      filtered.sort((a, b) => b.carbs - a.carbs);
    } else if (sort === 'fat') {
      filtered.sort((a, b) => b.fat - a.fat);
    }

    return filtered;
  });

  // Category counts
  public categoryCounts = computed(() => {
    const all = this.allProductsSignal();
    return {
      all: all.length,
      [ProductCategory.VEGETABLES]: all.filter(p => p.category === ProductCategory.VEGETABLES).length,
      [ProductCategory.MEAT]: all.filter(p => p.category === ProductCategory.MEAT).length,
      [ProductCategory.DAIRY]: all.filter(p => p.category === ProductCategory.DAIRY).length,
      [ProductCategory.GRAINS]: all.filter(p => p.category === ProductCategory.GRAINS).length,
      [ProductCategory.OTHER]: all.filter(p => p.category === ProductCategory.OTHER).length,
    };
  });

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.allProductsSignal.set(data['products'] || [])),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public openProduct(productId: string) {
    this.router.navigate([`${this.router.url}/${productId}`]);
  }

  public editProduct(productId: string) {
    this.router.navigate([`${this.router.url}/${productId}/edit`]);
  }

  public deleteProduct(productId: string) {
    // TODO: Implement delete functionality
    console.log('Delete product:', productId);
  }

  public addNewProduct() {
    this.router.navigate([`${this.router.url}/new`]);
  }

  public setCategory(category: ProductCategory | 'all') {
    this.activeCategory.set(category);
  }

  public getCategoryBadgeClass(category: ProductCategory): string {
    return this.categoryMeta[category]?.badgeCls || 'badge-other';
  }

  public getCategoryChipClass(category: ProductCategory | 'all'): string {
    if (category === 'all') return 'chip-active';
    return this.categoryMeta[category]?.chipCls || 'chip-default';
  }

  public getCategoryBackground(category: ProductCategory): string {
    const bgColors = {
      [ProductCategory.VEGETABLES]: 'rgba(106,145,99,0.08)',
      [ProductCategory.MEAT]: 'rgba(192,107,63,0.08)',
      [ProductCategory.DAIRY]: 'rgba(212,185,140,0.15)',
      [ProductCategory.GRAINS]: 'rgba(160,112,96,0.08)',
      [ProductCategory.OTHER]: 'rgba(61,43,31,0.05)',
    };
    return bgColors[category] || 'var(--cream-100)';
  }

  public getCategoryMeta(category: ProductCategory) {
    return this.categoryMeta[category];
  }

  public getCategoryCount(category: ProductCategory) {
    return this.categoryCounts()[category];
  }
}
