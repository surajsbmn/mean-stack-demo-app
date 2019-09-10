import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../models/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // Posts array
   posts: Post[] = [];
  isLoading = false;
  // post Subscription object
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    // call getPosts() from PostsService when component loads
   // this.posts = this.postsService.getPosts();

    this.isLoading = true;
    this.postsService.getPosts();

    // Subscribe to getPostUpdateListener() which returns observable
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  // unsubscribe to the subscription to avoid memory leaks
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
