import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    private apiUrl = 'http://localhost:8080/api/photos';

    constructor(private http: HttpClient) {}

    uploadPhoto(file: File, photo: Partial<Photo>): Observable<Photo> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', photo.title!);
        formData.append('description', photo.description || '');
        formData.append('albumId', photo.albumId!.toString());

        return this.http.post<Photo>(this.apiUrl, formData);
    }

    getPhotosByAlbum(albumId: number, page: number = 0, size: number = 20): Observable<Photo[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<Photo[]>(`${this.apiUrl}/album/${albumId}`, { params });
    }

    getPhoto(id: number): Observable<Photo> {
        return this.http.get<Photo>(`${this.apiUrl}/${id}`);
    }

    updatePhoto(id: number, photo: Partial<Photo>): Observable<Photo> {
        return this.http.put<Photo>(`${this.apiUrl}/${id}`, photo);
    }

    deletePhoto(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    downloadPhoto(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
    }
}
