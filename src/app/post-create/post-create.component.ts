import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // Initial data
  enteredTitle = '';
  enteredContent = '';

  private mode = 'create';
  private postId: string;
  post: Post;
  // Dependency injection (using public will automatically create the property)
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId)
        .subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content }
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: null, title: '', content: '' };
      }
    });
  }

  // Funtion to be called on addition of new post (getting form as a parameter of type NgForm)
  onSavePost(form: NgForm) {

    // check if form is valid
    if (form.invalid) {
      return;
    }


    if (this.mode === 'create') {
      // Pass the data to the PostsService
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    // clear and reset the fields of the form
    form.resetForm();
  }

}
