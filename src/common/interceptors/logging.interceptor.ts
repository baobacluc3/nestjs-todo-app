// src/common/interceptors/logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const { method, url, body, ip, headers } = req;
      const userAgent = headers['user-agent'] || '';
      const userId = req.user ? req.user.id : 'anonymous';
  
      this.logger.log(
        `Request: ${method} ${url} - User: ${userId} - IP: ${ip} - ${userAgent}`,
      );
  
      if (Object.keys(body).length > 0) {
        // Don't log sensitive data like passwords
        const sanitizedBody = { ...body };
        if (sanitizedBody.password) {
          sanitizedBody.password = '********';
        }
        this.logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
      }
  
      const now = Date.now();
      return next.handle().pipe(
        tap(
          (data) => {
            const response = context.switchToHttp().getResponse();
            const responseTime = Date.now() - now;
            
            this.logger.log(
              `Response: ${method} ${url} - ${response.statusCode} - ${responseTime}ms`,
            );
            
            // Only log response data for non-file responses and not too large
            if (data && typeof data === 'object' && !Buffer.isBuffer(data)) {
              const dataStr = JSON.stringify(data).substring(0, 1000);
              this.logger.debug(`Response data: ${dataStr}${dataStr.length >= 1000 ? '...' : ''}`);
            }
          },
          (error) => {
            const responseTime = Date.now() - now;
            this.logger.error(
              `Error: ${method} ${url} - ${error.message} - ${responseTime}ms`,
            );
          },
        ),
      );
    }
  }