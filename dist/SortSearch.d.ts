import { IPaginatorRequest, IPaginatorReturn } from '@solidbasisventures/intelliwaketsfoundation';
export declare const PaginatorInitializeReturnFromRequest: <T = any>(paginatorRequest: IPaginatorRequest) => IPaginatorReturn<T>;
export declare const PaginatorApplyRowCount: (paginatorReturn: IPaginatorReturn, rowCount: number) => void;
