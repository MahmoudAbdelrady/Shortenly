import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  PageableResponse,
  ShortenFormData,
  ShortLinkRecord,
  ShortLinkResult,
  ShortLinkSearch,
  ShortLinkStatistics,
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
    params['page'] = search.page ?? 0;
    params['size'] = search.size ?? 10;

    return this.httpClient.get<PageableResponse<ShortLinkRecord>>(
      `${environment.apiUrl}/short-links`,
      { params },
    );
  }

  public statistics() {
    return this.httpClient.get<ShortLinkStatistics>(`${environment.apiUrl}/short-links/statistics`);
  }

  public shorten(data: ShortenFormData) {
    return this.httpClient.post<ShortLinkResult>(`${environment.apiUrl}/short-links`, data);
  }

  public deactivate(id: string) {
    return this.httpClient.patch<ShortLinkRecord>(
      `${environment.apiUrl}/short-links/${id}/deactivate`,
      {},
    );
  }
}
