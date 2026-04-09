export function parsePagination(query, options = {}) {
  const defaultPage = options.defaultPage ?? 1;
  const defaultPageSize = options.defaultPageSize ?? 20;
  const maxPageSize = options.maxPageSize ?? 50;

  const pageRaw = Number(query.page ?? defaultPage);
  const pageSizeRaw = Number(query.pageSize ?? defaultPageSize);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : defaultPage;
  const pageSizeUncapped = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
    ? Math.floor(pageSizeRaw)
    : defaultPageSize;
  const pageSize = Math.min(pageSizeUncapped, maxPageSize);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function buildPagination(total, page, pageSize) {
  const safeTotal = Number(total ?? 0);
  return {
    page,
    pageSize,
    total: safeTotal,
    totalPages: Math.max(1, Math.ceil(safeTotal / pageSize)),
  };
}