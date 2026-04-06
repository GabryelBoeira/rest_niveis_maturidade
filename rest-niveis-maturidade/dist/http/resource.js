"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCollection = exports.Resource = void 0;
class Resource {
    constructor(data, meta) {
        this.data = data;
        this.meta = meta;
    }
    toJSON() {
        return Object.assign({ data: this.data }, (this.meta ? { meta: this.meta } : {}));
    }
}
exports.Resource = Resource;
class ResourceCollection extends Resource {
    constructor(data, meta) {
        super(data, meta);
    }
    toJSON() {
        const { pagination, other } = this.meta || {};
        const meta = Object.assign(Object.assign({}, other), { current_page: pagination === null || pagination === void 0 ? void 0 : pagination.page, per_page: pagination === null || pagination === void 0 ? void 0 : pagination.limit, total_items: pagination === null || pagination === void 0 ? void 0 : pagination.total });
        return {
            data: this.data,
            meta: meta,
        };
    }
}
exports.ResourceCollection = ResourceCollection;
