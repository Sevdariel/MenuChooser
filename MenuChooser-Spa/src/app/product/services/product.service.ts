import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProduct } from '../models/product.model';
import { Observable } from 'rxjs';
import { IUpdateProductDto } from '../models/product-dto.model';

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
}
