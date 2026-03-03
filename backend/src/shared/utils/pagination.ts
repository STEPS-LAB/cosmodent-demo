import { PaginatedResult, PaginationQuery } from '../types';

export function parsePagination(query: PaginationQuery) {
  const page  = Math.max(1, Number(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip  = (page - 1) * limit;
  const sortField = query.sort ?? 'createdAt';
  const sortOrder = query.order === 'asc' ? 1 : -1;
  return { page, limit, skip, sortField, sortOrder };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
