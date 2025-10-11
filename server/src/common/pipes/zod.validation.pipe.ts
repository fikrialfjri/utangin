import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

interface ZodSchemaClass {
  schema: ZodType<any, any, any>;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (this.isZodSchemaClass(metadata.metatype)) {
      const schema = metadata.metatype.schema;
      const result = schema.safeParse(value);

      if (!result.success) {
        const error = result.error;

        if (error instanceof ZodError) {
          const formattedErrors = error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          }));

          throw new BadRequestException({
            message: 'Validation failed',
            errors: formattedErrors,
          });
        }

        throw new BadRequestException('Invalid request payload');
      }
    }
  }

  private isZodSchemaClass(metatype?: unknown): metatype is ZodSchemaClass {
    if (typeof metatype !== 'function') return false;
    const ctor = metatype as unknown as ZodSchemaClass;
    return !!ctor.schema && typeof ctor.schema.safeParse === 'function';
  }
}
