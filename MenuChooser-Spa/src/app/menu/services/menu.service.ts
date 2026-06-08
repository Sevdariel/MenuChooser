import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MenuGenerateRequest, MenuPreviewDto } from '../models/menu-dto.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl = 'api/menus';

  public generateMenu(menuGenerateRequest: MenuGenerateRequest) {
    return this.httpClient.post<Blob>(
      `${this.baseUrl}/generate`,
      menuGenerateRequest,
      { responseType: 'blob' as 'json' },
    );
  }

  public previewMenu(menuGenerateRequest: MenuGenerateRequest) {
    return this.httpClient.post<MenuPreviewDto>(
      `${this.baseUrl}/preview`,
      menuGenerateRequest,
    );
  }

  public generateMenuFromPreview(preview: MenuPreviewDto) {
    return this.httpClient.post<Blob>(
      `${this.baseUrl}/generate-from-preview`,
      preview,
      { responseType: 'blob' as 'json' },
    );
  }
}
