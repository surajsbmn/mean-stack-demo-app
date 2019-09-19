import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  // postUpdated of type Subject of array of Post (Observable)
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // return subject as an observable
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:5200/api/posts' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPost(id: string) {
    // return {...this.posts.find(post => post.id === id)};
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:5200/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:5200/api/posts',
        postData
      )
      .subscribe(responseData => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title,
        //   content,
        //   imagePath: responseData.post.imagePath
        // };
        // const id = responseData.post.id;
        // post.id = id;

        // // Add new post to the array
        // this.posts.push(post);

        // // call next on subject and pass by value the post array
        // this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: FormData | Post;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }

    this.http
      .put('http://localhost:5200/api/posts/' + id, postData)
      .subscribe(response => {
        // console.log(response);
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id,
        //   title,
        //   content,
        //   imagePath: '' // response.imagePath
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;

        // this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    // this.http
    //   .delete('http://localhost:5200/api/posts/' + postId)
    //   .subscribe(() => {
    //     const updatedPosts = this.posts.filter(post => post.id !== postId);
    //     this.posts = updatedPosts;
    //     this.postsUpdated.next([...this.posts]);
    //   });
    return this.http.delete('http://localhost:5200/api/posts/' + postId);
  }
}
