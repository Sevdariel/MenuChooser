import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly httpClient = inject(HttpClient);

    private readonly baseUrl = 'api/menus';

    public generateMenu() {
        return this.httpClient.post(`${this.baseUrl}/generate`, {});
    }
}