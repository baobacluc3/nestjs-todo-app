// src/common/interfaces/pagination-response.interface.ts
export interface PaginationResponse<T> {
    items: T[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }