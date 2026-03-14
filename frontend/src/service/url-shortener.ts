import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  PageableResponse,
  ShortenFormData,
  ShortLinkRecord,
  ShortLinkResult,
  ShortLinkSearch,
} from '../shared/types/general';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlShortenerService {
  private httpClient = inject(HttpClient);

  public search(search: ShortLinkSearch) {
    const params = Object.fromEntries(
      Object.entries(search).filter(([, v]) => v != null && v !== undefined && v !== ''),
    );

    return this.httpClient.get<PageableResponse<ShortLinkRecord[]>>(
      `${environment.apiUrl}/short-links`,
      { params },
    );
  }

  public shorten(data: ShortenFormData) {
    return this.httpClient.post<ShortLinkResult>(`${environment.apiUrl}/short-links`, data);
  }
}
