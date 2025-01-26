import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';

@Component({
    selector: 'app-photo-form',
    templateUrl: './photo-form.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class PhotoFormComponent implements OnInit {
    photoForm: FormGroup;
    isEditing = false;
    photoId?: number;
    albums: Album[] = [];
    selectedFile?: File;
    previewUrl?: string;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private photoService: PhotoService,
        private albumService: AlbumService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.photoForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]],
            albumId: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadAlbums();

        this.route.queryParams.subscribe(params => {
            const albumId = params['albumId'];
            if (albumId) {
                this.photoForm.patchValue({
                    albumId: +albumId
                });
            }
        });

        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.isEditing = true;
                this.photoId = +id;
                this.loadPhoto();
            }
        });
    }

    loadAlbums(): void {
        this.albumService.getAlbums()
            .subscribe(albums => this.albums = albums);
    }

    loadPhoto(): void {
        if (this.photoId === undefined) return;

        this.photoService.getPhoto(this.photoId)
            .subscribe(photo => {
                this.photoForm.patchValue({
                    title: photo.title,
                    description: photo.description,
                    albumId: photo.albumId
                });
                this.previewUrl = this.photoService.getImageUrl(photo.id!);
            });
    }

    onFileSelected(event: Event): void {
        const element = event.target as HTMLInputElement;
        const file = element.files?.[0];
        if (file) {
            this.selectedFile = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (this.photoForm.valid && !this.submitting) {
            this.submitting = true;
            const photoData = this.photoForm.value;

            if (this.isEditing && this.photoId !== undefined) {
                this.photoService.updatePhoto(this.photoId, photoData)
                    .subscribe({
                        next: () => {
                            this.router.navigate(['/albums', photoData.albumId]);
                        },
                        error: (error) => {
                            console.error('Error updating photo:', error);
                            this.submitting = false;
                        }
                    });
            } else {
                if (!this.selectedFile) {
                    alert('Please select a file');
                    this.submitting = false;
                    return;
                }

                this.photoService.uploadPhoto(this.selectedFile, photoData)
                    .subscribe({
                        next: () => {
                            this.router.navigate(['/albums', photoData.albumId]);
                        },
                        error: (error) => {
                            console.error('Error uploading photo:', error);
                            this.submitting = false;
                        }
                    });
            }
        }
    }
}
