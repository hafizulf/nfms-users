import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import fileType from 'file-type';

@Injectable()
export class FileImagePipe implements PipeTransform {
  constructor(
    private readonly allowed: ReadonlyArray<string> = ['image/png','image/jpeg'],
    private readonly required = true,
  ) {}

  async transform(file: any) {
    if (!file?.buffer) {
      if (this.required) throw new BadRequestException('image file is required');
      return undefined;
    }

    const kind = await fileType.fromBuffer(file.buffer);
    const detected = kind?.mime ?? 'unknown';
    if (!this.allowed.includes(detected)) {
      throw new BadRequestException(`Invalid image content: ${detected}`);
    }
    file.mimetype = detected;
    (file as any).detectedExt = kind?.ext;
    return file;
  }
}

