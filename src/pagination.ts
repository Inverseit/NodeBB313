import * as _ from 'lodash';
import * as qs from 'querystring';
import { Pagination, Page } from './types/pagination'; // Modify the path accordingly


export function create(
    currentPage: number | string,
    pageCount: number | string,
    queryObj?: qs.ParsedUrlQueryInput
): Pagination {
    let _currentPage: number = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage;
    const _pageCount: number = typeof pageCount === 'string' ? parseInt(pageCount, 10) : pageCount;
    if (_pageCount <= 1) {
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
    let pagesToShow: number[] = [1, 2, _pageCount - 1, _pageCount];

    _currentPage = _currentPage || 1;
    const previous = Math.max(1, _currentPage - 1);
    const next = Math.min(_pageCount, _currentPage + 1);

    let startPage: number = Math.max(1, _currentPage - 2);
    if (startPage > _pageCount - 5) {
        startPage -= 2 - (_pageCount - _currentPage);
    }
    let i: number;
    for (i = 0; i < 5; i += 1) {
        pagesToShow.push(startPage + i);
    }

    pagesToShow = _.uniq(pagesToShow).filter(page => page > 0 && page <= pageCount).sort((a, b) => a - b);

    queryObj = { ...(queryObj || {}) };

    delete queryObj._;

    const pages: Page[] = pagesToShow.map((page) => {
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
            } else if (pages[i].page - 1 !== pages[i - 1].page) {
                // making a default values to create a separator
                pages.splice(i, 0, { separator: true, page: -1, active: false, qs: '' });
            }
        }
    }

    const data: Pagination = {
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
            href: `?${qs.stringify({ ...queryObj, page: next })}`,
        });
    }

    if (currentPage > 1) {
        data.rel.push({
            rel: 'prev',
            href: `?${qs.stringify({ ...queryObj, page: previous })}`,
        });
    }
    return data;
}
// A Hack To redefine named export
export default {
    create: create,
};


