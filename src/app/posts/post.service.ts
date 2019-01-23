import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class PostService {

  private posts: Post[] = [];
  private postSubject: Subject<any> = new Subject();

  constructor(private http: HttpClient, private router: Router) {

  }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      // Transform data stream via operators
      .pipe(map(postData => {
        return postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagepath: post.imagepath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        console.log(transformedPosts);
        this.posts = transformedPosts;

        this.postSubject.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postSubject.asObservable();
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);


    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe(resp => {
      console.log(resp.message);

      // set newly creted post id
      post.id = resp.post.id;
      post.imagepath = resp.post.imagepath;

      this.posts.push(post);
      this.postSubject.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/delete/' + id).subscribe(resp => {
      const updatedPosts = this.posts.filter(post => {
        return post.id !== id;
      });
      this.posts = updatedPosts;
      this.postSubject.next([...this.posts]);
    });
  }

  getPost(postId) {
    return this.http.get<{ message: string, post: any }>('http://localhost:3000/api/posts/edit/' + postId);

    // return {
    //   ...this.posts.find(post => {
    //     if (post.id === postId) {
    //       return true;
    //     }
    //     return false;
    //   })
    // };
  }

  updatePost(post: Post) {
    this.http.put('http://localhost:3000/api/posts/update/' + post.id, post).subscribe((resp) => {
      console.log(resp);
      this.router.navigate(['/']);
    });
  }
}
