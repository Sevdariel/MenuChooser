import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddProductDto, IUpdateProductDto } from '../models/product-dto.model';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl = `api/product`;

  public getProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${this.baseUrl}`)
  }

  public getProduct(productId: string): Observable<IProduct> {
    return this.httpClient.get<IProduct>(`${this.baseUrl}/${productId}`);
  }

  public updateProduct(productDto: IUpdateProductDto) {
    return this.httpClient.put(`${this.baseUrl}`, productDto);
  }

  public addProduct(productDto: IAddProductDto): Observable<IProduct> {
    return this.httpClient.post<IProduct>(`${this.baseUrl}`, productDto);
  }

  public getFilteredProducts(searchPattern: string): Observable<IProduct[]> {
    const params = new HttpParams().set('searchPattern', searchPattern);

    return this.httpClient.get<IProduct[]>(`${this.baseUrl}/items`, { params });
  }
}
