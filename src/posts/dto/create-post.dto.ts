import { IsString, MaxLength, Validate } from 'class-validator';
import { BlogIdBodyValidator } from '../validators/blog-id-body.validator';

export class CreatePostInputModelDto {
  @IsString()
  @MaxLength(30)
  title: string;
  @IsString()
  @MaxLength(100)
  shortDescription: string;
  @IsString()
  @MaxLength(1000)
  content: string;
  @Validate(BlogIdBodyValidator)
  blogId: string;
}
