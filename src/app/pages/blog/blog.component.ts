import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';
import { AuthService } from 'src/app/services/auth.service';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/app-models/user';

@Component({
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  data;
  user: User;
  blogs: Blog[] = [];
  breakpoint: number;
  isLoading = false;
  errorMessage: string;
  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions = [10];
  showFirstLastButtons = true;

  constructor(
    private router: Router,
    private databaseHandlerService: DatabaseHandlerService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.calculateBreakPoint(window.innerWidth);
    this.fetchData(null);
    this.store
      .select('auth')
      .pipe(
        take(1),
        map((state) => state.user)
      )
      .subscribe((user) => (this.user = user));
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.isLoading = true;
    this.fetchData(this.data.meta.links[this.pageIndex + 1].url);
  }

  onBlogDelete(id) {
    console.log('delete ', id);
    this.isLoading = true;
    this.authService.deleteBlog(id).subscribe(response=>{
      this.blogs = this.blogs.filter(blog => blog.id !== id);
      this.isLoading = false;
      console.log(response);
    },
    error=>{
      this.isLoading = false;
      this.errorMessage = error;
    });
  }

  fetchData(url: null) {
    this.errorMessage = null;
    this.blogs = [];
    this.databaseHandlerService.getBlogs(url).subscribe(
      (response) => this.subscribeResponse(response),
      (errorMessage) => this.subscribeError(errorMessage)
    );
  }

  subscribeResponse(response) {
    console.log(response);
    this.data = response;
    for (let blog of response.data) {
      this.blogs.push({
        id: blog.id.toString(),
        title: blog.title,
        summary: blog.summary,
        imageUrl: blog.imageUrl,
        body: JSON.parse(blog.body),
        date: new Date(blog.date),
      });
    }
    this.length = this.data.meta.total;
    this.pageSize = this.data.meta.per_page;
    this.pageIndex = this.data.meta.current_page - 1;
    this.isLoading = false;
    if (!this.data || this.data.data.length === 0){
      this.errorMessage = 'No Content';
    }
  }

  subscribeError(errorMessage) {
    this.errorMessage = errorMessage;
    console.log(this.errorMessage);
    this.isLoading = false;
  }

  onBlogClick(id: number) {
    this.router.navigateByUrl('/blog/' + id);
  }

  onResize(event) {
    this.calculateBreakPoint(event.target.innerWidth);
  }

  calculateBreakPoint(innerWidth: number) {
    if (innerWidth < 1201) {
      this.breakpoint = 1;
    } else this.breakpoint = 2;
  }
}

export class Blog {
  id: string;
  title: string;
  summary: string;
  body: { tag: string; element: string }[] = [];
  imageUrl: string;
  date: Date;
}
