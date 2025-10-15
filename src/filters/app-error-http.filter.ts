import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppError } from 'src/modules/common/errors/app-error';

@Catch(AppError)
export class AppErrorHttpFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const type = host.getType();

    if (type === 'http') {
      const reply = host.switchToHttp().getResponse<FastifyReply>();
      const status = exception.httpStatus;

      reply.code(status).send({
        statusCode: status,
        code: exception.code,
        message: exception.message,
      });
    }
  }
}
