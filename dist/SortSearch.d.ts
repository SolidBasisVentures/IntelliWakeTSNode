import { IPaginatorRequest, IPaginatorResponse } from '@solidbasisventures/intelliwaketsfoundation';
export declare const PaginatorInitializeResponseFromRequest: <T = any>(paginatorRequest: IPaginatorRequest) => IPaginatorResponse<T>;
export declare const PaginatorApplyRowCount: (paginatorResponse: IPaginatorResponse, rowCount: number) => void;
