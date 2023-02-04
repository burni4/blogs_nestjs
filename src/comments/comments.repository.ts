import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, CommentManager } from './schemas/comments.schemas';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentManager.name)
    private CommentModel: Model<CommentDocument>,
  ) {}

  async save(comment: CommentManager): Promise<CommentManager | null> {
    try {
      const newComment = new this.CommentModel({ ...comment });
      await newComment.save();
      return comment;
    } catch (error) {
      return null;
    }
  }
}
