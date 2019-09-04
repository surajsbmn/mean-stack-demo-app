import { Component, OnInit} from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // Initial data
  enteredTitle = '';
  enteredContent = '';

  // Dependency injection (using public will automatically create the property)
  constructor(public postsService: PostsService) { }

  ngOnInit() {
  }

  // Funtion to be called on addition of new post (getting form as a parameter of type NgForm)
  onAddPost(form: NgForm) {

    // check if form is valid
    if (form.invalid) {
      return;
    }

    // Pass the data to the PostsService
    this.postsService.addPost(form.value.title, form.value.content);

    // clear and reset the fields of the form
    form.resetForm();
  }

}
