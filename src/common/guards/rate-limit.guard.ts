// src/common/guards/rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

// Simple in-memory rate limiter
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requestMap = new Map<string, number[]>();
  private readonly limit = 100; // 100 requests
  private readonly windowMs = 60 * 1000; // 1 minute

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const now = Date.now();
    
    if (!this.requestMap.has(ip)) {
      this.requestMap.set(ip, [now]);
      return true;
    }
    
    const requests = this.requestMap.get(ip) || [];
    const windowStart = now - this.windowMs;
    
    // Filter requests to keep only recent ones within the time window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Set recent requests back to the map
    this.requestMap.set(ip, [...recentRequests, now]);
    
    // Check if limit is reached
    if (recentRequests.length >= this.limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    
    return true;
  }
}