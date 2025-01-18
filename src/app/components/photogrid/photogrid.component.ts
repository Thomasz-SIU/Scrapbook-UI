import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AlbumService } from '../../services/album.service';
import { Photo } from '../../models/photo.model';
import { Album } from '../../models/album.model';

@Component({
    selector: 'app-photo-grid',
    templateUrl: './photo-grid.component.html'
})
export class PhotoGridComponent implements OnInit {
    photos: Photo[] = [];
    album?: Album;
    currentPage = 0;
    pageSize = 20;

    constructor(
        private route: ActivatedRoute,
        private photoService: PhotoService,
        private albumService: AlbumService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const albumId = +params['id'];
            this.loadAlbum(albumId);
            this.loadPhotos(albumId);
        });
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
        this.currentPage++;
        this.photoService.getPhotosByAlbum(this.album!.id!, this.currentPage, this.pageSize)
            .subscribe(photos => this.photos = [...this.photos, ...photos]);
    }

    downloadPhoto(photo: Photo): void {
        this.photoService.downloadPhoto(photo.id!)
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
