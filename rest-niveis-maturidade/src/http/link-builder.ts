type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class LinkBuilder {
  private links: Record<string, any> = {};
  private baseUrl: string;

  constructor(basePath: string, id?: string | number) {
    this.baseUrl = id !== undefined ? `${basePath}/${id}` : basePath;
  }

  static from(basePath: string, id?: string | number) {
    return new LinkBuilder(basePath, id);
  }

  static crud(basePath: string, id?: string | number) {
    return new LinkBuilder(basePath, id).crud().build();
  }

  self() {
    this.links.self = {
      href: this.baseUrl,
      action: "GET",
      type: "application/json",
    };
    return this;
  }

  put() {
    this.links.put = {
      href: this.baseUrl,
      action: "PUT",
      type: "application/json",
    };
    return this;
  }

  patch() {
    this.links.patch = {
      href: this.baseUrl,
      action: "PATCH",
      type: "application/json",
    };
    return this;
  }

  delete() {
    this.links.delete = {
      href: this.baseUrl,
      action: "DELETE",
      type: "application/json",
    };
    return this;
  }

  // Permite adicionar QUALQUER link customizado (ex: /products/123/publish)
  custom(rel: string, pathSuffix: string, action: HttpMethod) {
    this.links[rel] = {
      href: `${this.baseUrl}${pathSuffix}`,
      action,
      type: "application/json",
    };
    return this;
  }

  crud() {
    return this.self().patch().delete();
  }

  // Adicionar todos de uma vez
  all() {
    return this.self().put().patch().delete();
  }

  build() {
    return this.links;
  }
}
