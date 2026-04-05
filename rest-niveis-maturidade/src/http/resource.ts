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
