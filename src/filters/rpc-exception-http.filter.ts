import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FastifyReply } from 'fastify';

@Catch(RpcException)
export class RpcExceptionHttpFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>();
    const error = exception.getError() as { code?: number; message?: string; details?: string };

    let statusCode: number;
    switch(error.code) {
      case 3: {
        statusCode = 400;
        break;
      }
      case 5: {
        statusCode = 404;
        break;
      }
      default: {
        statusCode = 500;
      }
    }
    const message = error.message || 'Internal server error';
    
    reply.code(statusCode).send({
      statusCode,
      message,
      errors: error.details ? JSON.parse(error.details) : undefined,
    });
  }
}
