import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [
    // { title: 'First post', content: 'This is the first post' },
    // { title: 'Second post', content: 'This is the second post' },
    // { title: 'Third post', content: 'This is the third post' }
  ];

  subscription: Subscription;
  isLoading = false;

  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscription = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    });

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onDelete(id: string): void {
    this.postService.deletePost(id);
  }

  onChangePage = (event: PageEvent) => {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postService.getPosts(event.pageSize, this.currentPage);
  }

}
