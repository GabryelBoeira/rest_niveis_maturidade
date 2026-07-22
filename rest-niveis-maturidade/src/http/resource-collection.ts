import { LinkBuilder } from "./link-builder";
import { Resource } from "./resource";

export class ResourceCollectionHAL<
  T extends { id: string | number },
> extends Resource<T[]> {
  private basePath: string;
  private queryParams: Record<string, any>;

  constructor(
    data: T[],
    basePath: string,
    queryParams: Record<string, any>,
    meta: {
      pagination: { page: number; limit: number; total: number };
      [key: string]: any;
    },
  ) {
    super(data, meta);
    this.basePath = basePath;
    this.queryParams = queryParams;
  }

  // Gera a URL completa mantendo os filtros atuais e trocando apenas a página
  private buildPageUrl(page: number, limit: number): string {
    const params = new URLSearchParams();

    // Filtra e copia os query params existentes
    Object.entries(this.queryParams).forEach(([key, value]) => {
      const strVal = String(value);

      // Ignora page, limit, valores vazios e variáveis não resolvidas do cliente (ex: {{var}})
      if (
        key !== "page" &&
        key !== "limit" &&
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !strVal.startsWith("{{")
      ) {
        params.set(key, strVal);
      }
    });

    // Injeta a paginação correta e atualizada
    params.set("page", String(page));
    params.set("limit", String(limit));

    return `${this.basePath}?${params.toString()}`;
  }

  // Monta os links HATEOAS da paginação
  private buildPaginationLinks() {
    const { page, limit, total } = this.meta.pagination;
    const totalPages = Math.ceil(total / limit) || 1;

    const links: Record<string, any> = {
      self: {
        href: this.buildPageUrl(page, limit),
        action: "GET",
        type: "application/json",
      },
      first: {
        href: this.buildPageUrl(1, limit),
        action: "GET",
        type: "application/json",
      },
      last: {
        href: this.buildPageUrl(totalPages, limit),
        action: "GET",
        type: "application/json",
      },
    };

    if (page > 1) {
      links.prev = {
        href: this.buildPageUrl(page - 1, limit),
        action: "GET",
        type: "application/json",
      };
    }

    if (page < totalPages) {
      links.next = {
        href: this.buildPageUrl(page + 1, limit),
        action: "GET",
        type: "application/json",
      };
    }

    return links;
  }

  toJSON() {
    const { pagination, ...other } = this.meta || {};

    // Injeta links em cada item da coleção
    const dataWithLinks = this.data.map((item) => ({
      ...item,
      _links: LinkBuilder.crud(this.basePath, item.id),
    }));

    return {
      data: dataWithLinks,
      _links: this.buildPaginationLinks(), // Links de navegação das páginas
      meta: {
        ...other,
        current_page: pagination?.page,
        per_page: pagination?.limit,
        total_items: pagination?.total,
        total_pages: Math.ceil(
          (pagination?.total || 0) / (pagination?.limit || 1),
        ),
      },
    };
  }
}
