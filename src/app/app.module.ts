import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { PhotoGridComponent } from './components/photo-grid/photo-grid.component';
import { AlbumFormComponent } from './components/album-form/album-form.component';
import { PhotoFormComponent } from './components/photo-form/photo-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumListComponent,
    PhotoGridComponent,
    AlbumFormComponent,
    PhotoFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: AlbumListComponent },
      { path: 'albums/new', component: AlbumFormComponent },
      { path: 'albums/:id/edit', component: AlbumFormComponent },
      { path: 'albums/:id', component: PhotoGridComponent },
      { path: 'photos/new', component: PhotoFormComponent },
      { path: 'photos/:id/edit', component: PhotoFormComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
