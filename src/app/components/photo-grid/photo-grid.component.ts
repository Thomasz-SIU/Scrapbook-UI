import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AlbumService } from '../../services/album.service';
import { Photo } from '../../models/photo.model';
import { Album } from '../../models/album.model';

@Component({
    selector: 'app-photo-grid',
    templateUrl: './photo-grid.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class PhotoGridComponent implements OnInit {
    photos: Photo[] = [];
    album?: Album;
    currentPage = 0;
    pageSize = 20;
    private apiUrl = 'http://localhost:8080/api/photos';  // Match your API base URL

    constructor(
        private route: ActivatedRoute,
        private photoService: PhotoService,
        private albumService: AlbumService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const albumId = +params['id'];
            if (!isNaN(albumId)) {
                this.loadAlbum(albumId);
                this.loadPhotos(albumId);
            }
        });
    }

    getImageUrl(photo: Photo): string {
        return this.photoService.getImageUrl(photo.id!);
    }

    loadAlbum(albumId: number): void {
        this.albumService.getAlbum(albumId)
            .subscribe(album => this.album = album);
    }

    loadPhotos(albumId: number): void {
        this.photoService.getPhotosByAlbum(albumId, this.currentPage, this.pageSize)
            .subscribe(photos => this.photos = photos);
    }

    loadMore(): void {
        if (this.album?.id) {
            this.currentPage++;
            this.photoService.getPhotosByAlbum(this.album.id, this.currentPage, this.pageSize)
                .subscribe(photos => this.photos = [...this.photos, ...photos]);
        }
    }

    downloadPhoto(photo: Photo): void {
        if (photo.id === undefined) {
            console.error('Cannot download photo: ID is undefined');
            return;
        }
        this.photoService.downloadPhoto(photo.id)
            .subscribe(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = photo.fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
    }
}
