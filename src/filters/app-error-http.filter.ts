import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AppError } from '../modules/common/errors/app-error';
import { FastifyReply } from 'fastify';

@Catch(AppError)
export class AppErrorHttpFilter implements ExceptionFilter {
  catch(err: AppError, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>();
    const status = err.httpStatus;``
    
    reply.code(status).send({
      statusCode: status,
      code: err.code,
      message: err.message,
    });
  }
}
