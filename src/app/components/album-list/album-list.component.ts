import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';

@Component({
    selector: 'app-album-list',
    templateUrl: './album-list.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class AlbumListComponent implements OnInit {
    albums: Album[] = [];
    currentPage = 0;
    pageSize = 10;

    constructor(private albumService: AlbumService) {}

    ngOnInit(): void {
        this.loadAlbums();
    }

    loadAlbums(): void {
        this.albumService.getAlbums(this.currentPage, this.pageSize)
            .subscribe(albums => this.albums = albums);
    }

    loadMore(): void {
        this.currentPage++;
        this.albumService.getAlbums(this.currentPage, this.pageSize)
            .subscribe(albums => this.albums = [...this.albums, ...albums]);
    }

    deleteAlbum(albumId: number | undefined): void {
        if (albumId === undefined) {
            console.error('Cannot delete album: ID is undefined');
            return;
        }
        this.albumService.deleteAlbum(albumId)
            .subscribe(() => {
                this.albums = this.albums.filter(album => album.id !== albumId);
            });
    }
}
