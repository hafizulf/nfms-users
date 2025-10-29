import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileRequiredPipe implements PipeTransform {
  constructor(private readonly fieldName = 'image') {}

  transform(value: any) {
    if (!value || typeof value === 'function') {
      throw new BadRequestException(`${this.fieldName} file is required`);
    }
    if (!value.originalname || !value.mimetype || typeof value.size !== 'number') {
      throw new BadRequestException(`${this.fieldName} is invalid or empty`);
    }
    return value;
  }
}
