import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
  form: FormGroup;
  imagePreview: string;

  constructor(public postService: PostService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
      'content': new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

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
          this.post = { id: result.post._id, title: result.post.title, content: result.post.content, imagepath: null };

          this.form.setValue({ title: this.post.title, content: this.post.content });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: '', title: '', content: '', imagepath: null };
      }
    });
  }

  onAddPost = () => {
    if (this.form.invalid) {
      return;
    }
    const post: Post = { id: null, title: this.form.value.title, content: this.form.value.content, imagepath: null };
    this.postService.addPost(post, this.form.value.image);
    this.form.reset();
  }

  onUpdatePost = () => {
    if (this.form.invalid) {
      return;
    }
    const post: Post = { id: this.postId, title: this.form.value.title, content: this.form.value.content, imagepath: null };
    this.postService.updatePost(post);
    this.form.reset();
  }

  onSavePost = () => {
    if (!this.form.invalid) {
      this.isLoading = true;
    }

    if (this.mode === 'create') {
      this.onAddPost();
    } else {
      this.onUpdatePost();
    }
  }

  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ 'image': file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }
}
