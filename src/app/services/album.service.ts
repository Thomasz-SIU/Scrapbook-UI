import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album.model';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    private apiUrl = 'http://localhost:8080/api/albums';

    constructor(private http: HttpClient) {}

    createAlbum(album: Partial<Album>): Observable<Album> {
        return this.http.post<Album>(this.apiUrl, album);
    }

    getAlbum(id: number): Observable<Album> {
        return this.http.get<Album>(`${this.apiUrl}/${id}`);
    }

    getAlbums(page: number = 0, size: number = 10): Observable<Album[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<Album[]>(this.apiUrl, { params });
    }

    updateAlbum(id: number, album: Partial<Album>): Observable<Album> {
        return this.http.put<Album>(`${this.apiUrl}/${id}`, album);
    }

    deleteAlbum(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
