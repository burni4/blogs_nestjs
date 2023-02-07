import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BlogsService } from '../../blogs/blogs.service';

@ValidatorConstraint({ name: 'BlogIdBodyValidator', async: true })
export class BlogIdBodyValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogService: BlogsService) {}
  async validate(blogId: string): Promise<boolean> {
    try {
      const blog = await this.blogService.getBlogByID(blogId);
      return !!blog;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Blogs with this id does not exist';
  }
}
