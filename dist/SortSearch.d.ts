import { IPaginatorRequest, IPaginatorResponse } from '@solidbasisventures/intelliwaketsfoundation';
export declare const PaginatorResponseFromRequestCount: <T = Record<string, any>>(paginatorRequest: IPaginatorRequest<T>, rowCount: number) => IPaginatorResponse<T>;
export declare const PaginatorInitializeResponseFromRequest: <T = Record<string, any>>(paginatorRequest: IPaginatorRequest<T>) => IPaginatorResponse<T>;
export declare const PaginatorApplyRowCount: <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => void;
export declare const PaginatorReturnRowCount: <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => IPaginatorResponse<T>;
