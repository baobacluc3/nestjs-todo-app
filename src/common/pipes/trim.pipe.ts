// src/common/pipes/trim.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;
    
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object') {
      const trimmedValue = { ...value };
      Object.keys(trimmedValue).forEach(key => {
        if (typeof trimmedValue[key] === 'string') {
          trimmedValue[key] = trimmedValue[key].trim();
        }
      });
      return trimmedValue;
    }
    
    return value;
  }
}