import { Routes } from '@angular/router';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { PhotoGridComponent } from './components/photo-grid/photo-grid.component';
import { AlbumFormComponent } from './components/album-form/album-form.component';
import { PhotoFormComponent } from './components/photo-form/photo-form.component';

export const routes: Routes = [
    { path: '', component: AlbumListComponent },
    { path: 'albums/new', component: AlbumFormComponent },
    { path: 'albums/:id/edit', component: AlbumFormComponent },
    { path: 'albums/:id', component: PhotoGridComponent },
    { path: 'photos/new', component: PhotoFormComponent },
    { path: 'photos/:id/edit', component: PhotoFormComponent }
];
