import { 
  BadRequestException, 
  CallHandler,
  ExecutionContext, 
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { memoryStorage } from 'fastify-multer';
import { FastifyRequest } from 'fastify';
import {
  File,
  FileFilterCallback,
  FileInterceptor,
} from '@nest-lab/fastify-multer';

interface FileUploadInterceptorOptions {
  fieldName: string;
  maxSizeInMB: number;
  allowedMimeTypes: string[];
  destination: string;
}

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  public fieldName: string;
  public maxSizeInMB: number;
  public allowedMimeTypes: string[];
  public destination: string;

  constructor({
    fieldName = 'file',
    maxSizeInMB = 2,
    allowedMimeTypes = ['image/jpeg', 'image/png'],
    destination = 'images',
  }: FileUploadInterceptorOptions) {
    this.fieldName = fieldName;
    this.maxSizeInMB = maxSizeInMB;
    this.allowedMimeTypes = allowedMimeTypes;
    this.destination = destination;
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const limits = {
      fileSize: this.maxSizeInMB * 1024 * 1024,
      fields: 10,
      files: 1,
    };

    const storage = memoryStorage();
    const fileFilter = (
      _req: FastifyRequest,
      file: File,
      cb: FileFilterCallback,
    ) => {
      if (this.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            `Only files with types ${this.allowedMimeTypes.join(', ')} are allowed!`
          )
        );
      }
    };

    const MulterInterceptorClass = FileInterceptor(this.fieldName, {
      limits,
      storage,
      fileFilter,
    });
    const delegate = new (MulterInterceptorClass as any)();

    return delegate.intercept(context, next);
  }
}
