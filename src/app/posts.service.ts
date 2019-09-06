import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
    this.http
      .get<{ message: string; posts: any }>('http://localhost:5200/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPost => {
        this.posts = transformedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };

    this.http
      .post<{ message: string, postId: string }>('http://localhost:5200/api/posts', post)
      .subscribe(responseData => {
        console.log(responseData.message);

        const id = responseData.postId;
        post.id = id;
        // Add new post to the array
        this.posts.push(post);

        // call next on subject and pass by value the post array
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:5200/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
