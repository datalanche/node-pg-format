declare var reservedMap: any;
declare var fmtPattern: {
    ident: string;
    literal: string;
    string: string;
};
declare function formatDate(date: any): string;
declare function isReserved(value: any): boolean;
declare function arrayToList(useSpace: any, array: any, formatter: any): string;
declare function quoteIdent(value: any): string;
declare function quoteLiteral(value: any): string;
declare function quoteString(value: any): string;
declare function config(cfg: any): void;
declare function formatWithArray(fmt: any, parameters: any): any;
declare function format(fmt: string): string;
