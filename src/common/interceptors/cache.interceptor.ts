// src/common/interceptors/cache.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly defaultTTL = 60 * 1000; // 1 minute

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.switchToHttp().getRequest().method !== 'GET') {
      return next.handle();
    }

    const url = context.switchToHttp().getRequest().url;
    const cacheKey = url;
    const cachedData = this.cache.get(cacheKey);

    // If we have a valid cached response, return it
    if (cachedData && cachedData.expiresAt > Date.now()) {
      return of(cachedData.data);
    }

    // Otherwise, proceed with request and cache the response
    return next.handle().pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + this.defaultTTL,
        });
      }),
    );
  }
}