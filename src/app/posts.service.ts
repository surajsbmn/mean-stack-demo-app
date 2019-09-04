import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  // postUpdated of type Subject of array of Post (Observable)
  private postsUpdated = new Subject<Post[]>();

  constructor() { }

  // return subject as an observable
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title: title,
      content: content
    };

    // Add new post to the array
    this.posts.push(post);

    // call next on subject and pass by value the post array
    this.postsUpdated.next([...this.posts]);

  }
}
