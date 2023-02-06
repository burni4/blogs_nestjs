import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/posts.schemas';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument>,
  ) {}

  async deleteAllPosts(): Promise<boolean> {
    await this.PostModel.deleteMany({});
    return true;
  }
  async delete(post: Post): Promise<boolean> {
    try {
      const result = await this.PostModel.deleteOne({
        id: post.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async save(post: Post): Promise<Post | null> {
    try {
      const newPost = new this.PostModel({ ...post });
      await newPost.save();
      return post;
    } catch (error) {
      return null;
    }
  }

  async getPostByID(postId: string): Promise<Post | null> {
    const postFromDB: PostDocument = await this.PostModel.findOne({
      id: postId,
    }).exec();
    if (!postFromDB) return null;
    const post: Post = Post.postDocumentToPostClass(postFromDB);
    return post;
  }
  async update(post: Post): Promise<Post | null> {
    try {
      const result = await this.PostModel.updateOne(
        { id: post.id },
        { $set: post },
      );
      return post;
    } catch (error) {
      return null;
    }
  }
}
