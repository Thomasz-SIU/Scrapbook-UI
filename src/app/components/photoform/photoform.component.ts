import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';

@Component({
    selector: 'app-photo-form',
    templateUrl: './photo-form.component.html'
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
            albumId: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadAlbums();

        // Check for query params (albumId when creating new photo)
        this.route.queryParams.subscribe(params => {
            if (params['albumId']) {
                this.photoForm.patchValue({
                    albumId: +params['albumId']
                });
            }
        });

        // Check for route params (photoId when editing)
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditing = true;
                this.photoId = +params['id'];
                this.loadPhoto();
            }
        });
    }

    loadAlbums(): void {
        this.albumService.getAlbums()
            .subscribe(albums => this.albums = albums);
    }

    loadPhoto(): void {
        this.photoService.getPhoto(this.photoId!)
            .subscribe(photo => {
                this.photoForm.patchValue({
                    title: photo.title,
                    description: photo.description,
                    albumId: photo.albumId
                });
                this.previewUrl = photo.imageUrl;
            });
    }

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.selectedFile = file;

            // Create preview URL
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

            if (this.isEditing) {
                this.photoService.updatePhoto(this.photoId!, photoData)
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
