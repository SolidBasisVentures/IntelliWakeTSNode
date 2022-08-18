import { IPaginatorRequest, IPaginatorResponse } from '@solidbasisventures/intelliwaketsfoundation';
export declare const PaginatorResponseFromRequestCount: <SORT = Record<string, any>, FILTER = Record<string, any>>(paginatorRequest: IPaginatorRequest<SORT, FILTER>, rowCount: number) => IPaginatorResponse<SORT>;
export declare const PaginatorInitializeResponseFromRequest: <SORT = Record<string, any>, FILTER = Record<string, any>, RES = Record<string, any>>(paginatorRequest: IPaginatorRequest<SORT, FILTER>) => IPaginatorResponse<RES>;
export declare const PaginatorApplyRowCount: <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => void;
export declare const PaginatorReturnRowCount: <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => IPaginatorResponse<T>;
