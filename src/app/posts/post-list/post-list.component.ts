import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

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

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscription = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;

    });

    this.postService.getPosts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onDelete(id: string): void {
    this.postService.deletePost(id);
  }

}
