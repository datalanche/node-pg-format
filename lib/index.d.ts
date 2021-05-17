declare function quoteIdent(value: any): string;
declare function quoteLiteral(value: any): string;
declare function quoteString(value: any): string;
declare function formatWithArray(fmt: any, parameters: any): any;
declare function format(fmt: string, ...args: any[]): string;
declare namespace format {
    var config: (cfg: any) => void;
    var ident: typeof quoteIdent;
    var literal: typeof quoteLiteral;
    var string: typeof quoteString;
    var withArray: typeof formatWithArray;
}
export = format;
