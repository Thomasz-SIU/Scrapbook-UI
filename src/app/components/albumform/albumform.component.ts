import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';

@Component({
    selector: 'app-album-form',
    templateUrl: './album-form.component.html'
})
export class AlbumFormComponent implements OnInit {
    albumForm: FormGroup;
    isEditing = false;
    albumId?: number;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private albumService: AlbumService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.albumForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditing = true;
                this.albumId = +params['id'];
                this.loadAlbum();
            }
        });
    }

    loadAlbum(): void {
        this.albumService.getAlbum(this.albumId!)
            .subscribe(album => {
                this.albumForm.patchValue({
                    title: album.title,
                    description: album.description
                });
            });
    }

    onSubmit(): void {
        if (this.albumForm.valid && !this.submitting) {
            this.submitting = true;
            const albumData = this.albumForm.value;

            const request = this.isEditing ?
                this.albumService.updateAlbum(this.albumId!, albumData) :
                this.albumService.createAlbum(albumData);

            request.subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    console.error('Error saving album:', error);
                    this.submitting = false;
                }
            });
        }
    }
}
