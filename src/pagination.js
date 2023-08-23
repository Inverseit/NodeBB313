"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const _ = __importStar(require("lodash"));
const qs = __importStar(require("querystring"));
function create(currentPage, pageCount, queryObj) {
    console.log(currentPage, pageCount);
    let _currentPage = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage;
    const _pageCount = typeof pageCount === 'string' ? parseInt(pageCount, 10) : pageCount;
    if (pageCount <= 1) {
        return {
            prev: { page: 1, active: _currentPage > 1 },
            next: { page: 1, active: _currentPage < _pageCount },
            first: { page: 1, active: _currentPage === 1 },
            last: { page: 1, active: _currentPage === _pageCount },
            rel: [],
            pages: [],
            currentPage: 1,
            pageCount: 1,
        };
    }
    let pagesToShow = [1, 2, _pageCount - 1, _pageCount];
    _currentPage = _currentPage || 1;
    const previous = Math.max(1, _currentPage - 1);
    const next = Math.min(_pageCount, _currentPage + 1);
    let startPage = Math.max(1, _currentPage - 2);
    if (startPage > _pageCount - 5) {
        startPage -= 2 - (_pageCount - _currentPage);
    }
    let i;
    for (i = 0; i < 5; i += 1) {
        pagesToShow.push(startPage + i);
    }
    pagesToShow = _.uniq(pagesToShow).filter(page => page > 0 && page <= pageCount).sort((a, b) => a - b);
    queryObj = Object.assign({}, (queryObj || {}));
    delete queryObj._;
    const pages = pagesToShow.map((page) => {
        queryObj.page = page;
        return { page: page, active: page === currentPage, qs: qs.stringify(queryObj), separator: false };
    });
    for (i = pages.length - 1; i > 0; i -= 1) {
        if ('page' in pages[i] && 'page' in pages[i - 1]) {
            if (pages[i].page - 2 === pages[i - 1].page) {
                pages.splice(i, 0, {
                    page: pages[i].page - 1,
                    active: false,
                    qs: qs.stringify(queryObj),
                    separator: false,
                });
            }
            else if (pages[i].page - 1 !== pages[i - 1].page) {
                // making a default values to create a separator
                pages.splice(i, 0, { separator: true, page: -1, active: false, qs: '' });
            }
        }
    }
    const data = {
        rel: [],
        pages: pages,
        currentPage: _currentPage,
        pageCount: _pageCount,
        prev: undefined,
        next: undefined,
        first: undefined,
        last: undefined,
    };
    queryObj.page = previous;
    data.prev = { page: previous, active: currentPage > 1 };
    queryObj.page = next;
    data.next = { page: next, active: currentPage < pageCount };
    queryObj.page = 1;
    data.first = { page: 1, active: currentPage === 1 };
    queryObj.page = _pageCount;
    data.last = { page: _pageCount, active: _currentPage === _pageCount };
    if (_currentPage < _pageCount) {
        data.rel.push({
            rel: 'next',
            href: `?${qs.stringify(Object.assign(Object.assign({}, queryObj), { page: next }))}`,
        });
    }
    if (currentPage > 1) {
        data.rel.push({
            rel: 'prev',
            href: `?${qs.stringify(Object.assign(Object.assign({}, queryObj), { page: previous }))}`,
        });
    }
    console.log(data);
    return data;
}
exports.create = create;
// A Hack To redefine named export
exports.default = {
    create: create,
};
