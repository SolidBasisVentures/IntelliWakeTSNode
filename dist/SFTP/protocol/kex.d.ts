export const KexInit: {
    new (obj: any): {
        totalSize: number;
        lists: {
            kex: undefined;
            serverHostKey: undefined;
            cs: {
                cipher: undefined;
                mac: undefined;
                compress: undefined;
                lang: undefined;
            };
            sc: {
                cipher: undefined;
                mac: undefined;
                compress: undefined;
                lang: undefined;
            };
            all: undefined;
        };
        copyAllTo(buf: any, offset: any): any;
    };
};
export function kexinit(self: any): void;
export function onKEXPayload(state: any, payload: any): any;
export class onKEXPayload {
    constructor(state: any, payload: any);
    _skipNextInboundPacket: boolean | undefined;
}
declare function handleKexInit(self: any, payload: any): number | undefined;
export declare const DEFAULT_KEXINIT: {
    totalSize: number;
    lists: {
        kex: undefined;
        serverHostKey: undefined;
        cs: {
            cipher: undefined;
            mac: undefined;
            compress: undefined;
            lang: undefined;
        };
        sc: {
            cipher: undefined;
            mac: undefined;
            compress: undefined;
            lang: undefined;
        };
        all: undefined;
    };
    copyAllTo(buf: any, offset: any): any;
};
export declare const HANDLERS: {
    [x: number]: typeof handleKexInit;
};
export {};
