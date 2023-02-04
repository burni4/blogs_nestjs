import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false })
export class CommentManager {
  @Prop()
  id: string;
}

export type CommentDocument = HydratedDocument<CommentManager>;
export const CommentSchema = SchemaFactory.createForClass(CommentManager);
