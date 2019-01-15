import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {

  private posts: Post[] = [];
  private postSubject: Subject<any> = new Subject();

  getPosts() {
    // return this.posts.slice();
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postSubject.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postSubject.next();
  }
}
