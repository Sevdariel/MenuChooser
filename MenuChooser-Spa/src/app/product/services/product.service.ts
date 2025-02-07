import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProduct } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl = `api/product`;

  public getProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${this.baseUrl}`)
  }
}
