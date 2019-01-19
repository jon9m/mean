import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId;
  post: Post;
  isLoading = false;

  constructor(public postService: PostService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // Spinner
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(result => {
          console.log(result.post);
          // Spinner
          this.isLoading = false;
          this.post = { id: result.post._id, title: result.post.title, content: result.post.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: '', title: '', content: '' };
      }
    });
  }

  onAddPost = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const post: Post = { id: null, title: form.value.title, content: form.value.content };
    this.postService.addPost(post);
    form.resetForm();
  }

  onUpdatePost = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const post: Post = { id: this.postId, title: form.value.title, content: form.value.content };
    this.postService.updatePost(post);
    form.resetForm();
  }

  onSavePost = (form: NgForm) => {
    if (!form.invalid) {
      this.isLoading = true;
    }

    if (this.mode === 'create') {
      this.onAddPost(form);
    } else {
      this.onUpdatePost(form);
    }
  }
}
