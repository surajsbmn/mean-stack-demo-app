import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  // postUpdated of type Subject of array of Post (Observable)
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  // return subject as an observable
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:5200/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };

    this.http.post<{ message: string }>('http://localhost:5200/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);

        // Add new post to the array
        this.posts.push(post);

        // call next on subject and pass by value the post array
        this.postsUpdated.next([...this.posts]);
      });


  }
}
