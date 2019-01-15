import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService {

  private posts: Post[] = [];
  private postSubject: Subject<any> = new Subject();

  constructor(private http: HttpClient) {

  }

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts').subscribe((resp) => {
      console.log(resp);
      this.posts = resp.posts;

      this.postSubject.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postSubject.asObservable();
  }

  addPost(post: Post) {
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe(resp => {
      console.log(resp.message);

      this.posts.push(post);
      this.postSubject.next([...this.posts]);
    });
  }
}
