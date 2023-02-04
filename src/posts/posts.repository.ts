import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/posts.schemas';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostsModel: Model<PostDocument>,
  ) {}

  async deleteAllPosts(): Promise<boolean> {
    await this.PostsModel.deleteMany({});
    return true;
  }
  async save(post: Post): Promise<Post | null> {
    try {
      const newPost = new this.PostsModel({ ...post });
      await newPost.save();
      return post;
    } catch (error) {
      return null;
    }
  }
}
