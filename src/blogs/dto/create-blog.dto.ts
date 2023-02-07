import { IsUrl, Length } from 'class-validator';

export class CreateBlogInputModelDto {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
