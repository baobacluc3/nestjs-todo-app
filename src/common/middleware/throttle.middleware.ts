// src/common/middleware/throttle.middleware.ts
import { Injectable, NestMiddleware, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface ThrottleOptions {
  ttl: number;      // Time-to-live (milliseconds)
  limit: number;    // Maximum number of requests within ttl
}

@Injectable()
export class ThrottleMiddleware implements NestMiddleware {
  private readonly log = new Logger(ThrottleMiddleware.name);
  private readonly hits = new Map<string, number[]>();
  private readonly options: ThrottleOptions = {
    ttl: 60 * 1000, // 1 minute
    limit: 100,     // 100 requests per minute
  };

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || 
    req.connection.remoteAddress || 
    req.headers['x-forwarded-for'] as string || 
    'unknown';
    const now = Date.now();
    
    // Initialize if this is the first request from this IP
    if (!this.hits.has(ip)) {
      this.hits.set(ip, [now]);
      return next();
    }
    
    // Get existing hits and filter out expired ones
    const ipHits = this.hits.get(ip) || [];
    const recentHits = ipHits.filter(hit => hit > now - this.options.ttl);
    
    // Check if the limit is exceeded
    if (recentHits.length >= this.options.limit) {
      const resetTime = Math.ceil((ipHits[0] + this.options.ttl - now) / 1000);
      
      res.setHeader('Retry-After', String(resetTime));
      res.setHeader('X-RateLimit-Limit', String(this.options.limit));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(ipHits[0] / 1000) + this.options.ttl / 1000));
      
      this.log.warn(`Rate limit exceeded for IP: ${ip}`);
      
      throw new HttpException(
        `Too many requests. Please try again in ${resetTime} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    
    // Add this request and update the map
    recentHits.push(now);
    this.hits.set(ip, recentHits);
    
    // Add headers
    res.setHeader('X-RateLimit-Limit', String(this.options.limit));
    res.setHeader('X-RateLimit-Remaining', String(this.options.limit - recentHits.length));
    
    next();
  }
}