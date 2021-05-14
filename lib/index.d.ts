declare const reservedMap: any;
declare const fmtPattern: {
    ident: string;
    literal: string;
    string: string;
};
declare function formatDate(date: string): string;
declare function isReserved(value: string): boolean;
declare function arrayToList(useSpace: boolean, array: any[], formatter: (value: any) => string): string;
declare function quoteIdent(value: any): string;
declare function quoteLiteral(value: any): string;
declare function quoteString(value: any): string;
declare function config(cfg: any): void;
declare function formatWithArray(fmt: any, parameters: any): any;
declare function format(fmt: string, ...args: any[]): string;
