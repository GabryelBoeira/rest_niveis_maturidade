export class Resource<T = object> {
  constructor(
    protected data: T,
    protected meta?: any,
  ) {}

  toJSON() {
    return {
      data: this.data,
      ...(this.meta ? { meta: this.meta } : {}),
    };
  }
}

// ResourceCollection é uma subclasse de Resource que representa uma coleção de recursos.
// Náo esta no padrao HAL, mas é uma forma de representar uma coleção de recursos com metadados adicionais, como paginação.
export class ResourceCollection<T> extends Resource<T[]> {
  constructor(
    data: T[],
    meta?: {
      pagination?: { page: number; limit: number; total: number };
      [key: string]: any;
    },
  ) {
    super(data, meta);
  }

  toJSON() {
    const { pagination, other } = this.meta || {};
    const meta = {
      ...other,
      current_page: pagination?.page,
      per_page: pagination?.limit,
      total_items: pagination?.total,
    };

    return {
      data: this.data,
      meta: meta,
    };
  }
}
