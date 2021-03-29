import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';
import { Blog } from '../blog.component';

@Component({
  selector: 'app-show-blog',
  templateUrl: './show-blog.component.html',
  styleUrls: ['./show-blog.component.css']
})
export class ShowBlogComponent implements OnInit {

  blog: Blog = new Blog();
  errorMesssage: string;
  isLoading = false;

  constructor(private route: ActivatedRoute, private databaseHandlerSErvice: DatabaseHandlerService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.blog.id = params.id; // same as :username in route
    });
    this.isLoading = true;
    this.databaseHandlerSErvice.getBlog(this.blog.id).subscribe(
      response=>{
        console.log(response);
        this.blog.title = response.data.title;
        this.blog.summary = response.data.summary;
        this.blog.imageUrl = response.data.imageUrl;
        this.blog.date = new Date(response.data.date);
        this.blog.body = JSON.parse(response.data.body);
        this.isLoading = false;
      },
      error => {
        this.errorMesssage = error;
        this.isLoading = false;
      }
    );
  }
}
