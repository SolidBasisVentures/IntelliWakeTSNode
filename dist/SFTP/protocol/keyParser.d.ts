export function isParsedKey(val: any): boolean;
export function isSupportedKeyType(type: any): boolean;
declare function OpenSSH_Public(type: any, comment: any, pubPEM: any, pubSSH: any, algo: any): void;
declare class OpenSSH_Public {
    constructor(type: any, comment: any, pubPEM: any, pubSSH: any, algo: any);
    type: any;
    comment: any;
    [SYM_PRIV_PEM]: any;
    [SYM_PUB_PEM]: any;
    [SYM_PUB_SSH]: any;
    [SYM_HASH_ALGO]: any;
    [SYM_DECRYPTED]: boolean;
}
declare namespace OpenSSH_Public {
    function parse(str: any): Error | OpenSSH_Public | null;
}
export function parseKey(data: any, passphrase: any): any;
declare const SYM_PRIV_PEM: unique symbol;
declare const SYM_PUB_PEM: unique symbol;
declare const SYM_PUB_SSH: unique symbol;
declare const SYM_HASH_ALGO: unique symbol;
declare const SYM_DECRYPTED: unique symbol;
export declare function parseDERKey(data: any, type: any): Error | OpenSSH_Public;
export {};
