import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogComponent } from './blog.component';
import { ShowBlogComponent } from './show-blog/show-blog.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '../../shared/moduls/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BlogComponent },
  { path: ':id', component: ShowBlogComponent },
];

@NgModule({
  declarations: [
    BlogComponent,
    ShowBlogComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatPaginatorModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: []
})
export class BlogModule { }
