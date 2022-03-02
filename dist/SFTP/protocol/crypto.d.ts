/// <reference types="node" />
export const CIPHER_INFO: {
    'chacha20-poly1305@openssh.com': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes128-gcm': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes256-gcm': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes128-gcm@openssh.com': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes256-gcm@openssh.com': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes128-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes192-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes256-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'rijndael-cbc@lysator.liu.se': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    '3des-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'blowfish-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'idea-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'cast128-cbc': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes128-ctr': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes192-ctr': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'aes256-ctr': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    '3des-ctr': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'blowfish-ctr': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    'cast128-ctr': {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    arcfour: {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    arcfour128: {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    arcfour256: {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
    arcfour512: {
        sslName: any;
        blockLen: any;
        keyLen: any;
        ivLen: any;
        authLen: any;
        discardLen: any;
        stream: boolean;
    };
};
export const MAC_INFO: {
    'hmac-md5': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-md5-96': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-ripemd160': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha1': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha1-etm@openssh.com': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha1-96': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha2-256': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha2-256-etm@openssh.com': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha2-256-96': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha2-512': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha2-512-etm@openssh.com': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
    'hmac-sha2-512-96': {
        sslName: any;
        len: any;
        actualLen: any;
        isETM: any;
    };
};
export class NullCipher {
    constructor(seqno: any, onWrite: any);
    outSeqno: any;
    _onWrite: any;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
export function createCipher(config: any): ChaChaPolyCipherNative | ChaChaPolyCipherBinding | AESGCMCipherNative | AESGCMCipherBinding | GenericCipherNative | GenericCipherBinding;
export class NullDecipher {
    constructor(seqno: any, onPayload: any);
    inSeqno: any;
    _onPayload: any;
    _len: number;
    _lenBytes: number;
    _packet: any;
    _packetPos: number;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
}
export function createDecipher(config: any): ChaChaPolyDecipherNative | ChaChaPolyDecipherBinding | AESGCMDecipherNative | AESGCMDecipherBinding | GenericDecipherNative | GenericDecipherBinding;
declare class ChaChaPolyCipherNative {
    constructor(config: any);
    outSeqno: any;
    _onWrite: any;
    _encKeyMain: any;
    _encKeyPktLen: any;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
declare class ChaChaPolyCipherBinding {
    constructor(config: any);
    outSeqno: any;
    _onWrite: any;
    _instance: any;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
declare class AESGCMCipherNative {
    constructor(config: any);
    outSeqno: any;
    _onWrite: any;
    _encSSLName: any;
    _encKey: any;
    _encIV: any;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
declare class AESGCMCipherBinding {
    constructor(config: any);
    outSeqno: any;
    _onWrite: any;
    _instance: any;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
declare class GenericCipherNative {
    constructor(config: any);
    outSeqno: any;
    _onWrite: any;
    _encBlockLen: any;
    _cipherInstance: import("crypto").CipherGCM;
    _macSSLName: any;
    _macKey: any;
    _macActualLen: any;
    _macETM: any;
    _aadLen: number;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
declare class GenericCipherBinding {
    constructor(config: any);
    outSeqno: any;
    _onWrite: any;
    _encBlockLen: any;
    _macLen: any;
    _macActualLen: any;
    _aadLen: number;
    _instance: any;
    _dead: boolean;
    free(): void;
    allocPacket(payloadLen: any): Buffer;
    encrypt(packet: any): void;
}
declare class ChaChaPolyDecipherNative {
    constructor(config: any);
    inSeqno: any;
    _onPayload: any;
    _decKeyMain: any;
    _decKeyPktLen: any;
    _len: number;
    _lenBuf: Buffer;
    _lenPos: number;
    _packet: any;
    _pktLen: number;
    _mac: Buffer;
    _calcMac: Buffer;
    _macPos: number;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
}
declare class ChaChaPolyDecipherBinding {
    constructor(config: any);
    inSeqno: any;
    _onPayload: any;
    _instance: any;
    _len: number;
    _lenBuf: Buffer;
    _lenPos: number;
    _packet: any;
    _pktLen: number;
    _mac: Buffer;
    _macPos: number;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
}
declare class AESGCMDecipherNative {
    constructor(config: any);
    inSeqno: any;
    _onPayload: any;
    _decipherInstance: import("crypto").DecipherGCM | null;
    _decipherSSLName: any;
    _decipherKey: any;
    _decipherIV: any;
    _len: number;
    _lenBytes: number;
    _packet: Buffer | null;
    _packetPos: number;
    _pktLen: number;
    _tag: Buffer;
    _tagPos: number;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
}
declare class AESGCMDecipherBinding {
    constructor(config: any);
    inSeqno: any;
    _onPayload: any;
    _instance: any;
    _len: number;
    _lenBytes: number;
    _packet: any;
    _pktLen: number;
    _tag: Buffer;
    _tagPos: number;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
}
declare class GenericDecipherNative {
    constructor(config: any);
    inSeqno: any;
    _onPayload: any;
    _decipherInstance: import("crypto").DecipherGCM;
    _block: Buffer;
    _blockSize: any;
    _blockPos: number;
    _len: number;
    _packet: Buffer | null;
    _packetPos: number;
    _pktLen: number;
    _mac: Buffer;
    _macPos: number;
    _macSSLName: any;
    _macKey: any;
    _macActualLen: any;
    _macETM: any;
    _macInstance: import("crypto").Hmac | null;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
}
declare class GenericDecipherBinding {
    constructor(config: any);
    inSeqno: any;
    _onPayload: any;
    _instance: any;
    _block: Buffer;
    _blockPos: number;
    _len: number;
    _packet: any;
    _pktLen: number;
    _mac: Buffer;
    _macPos: number;
    _macActualLen: any;
    _macETM: any;
    free(): void;
    decrypt(data: any, p: any, dataLen: any): any;
    _macInstance: any;
}
export declare const bindingAvailable: boolean;
export declare const init: Promise<any>;
export {};
