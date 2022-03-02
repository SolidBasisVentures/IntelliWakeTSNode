export namespace COMPAT {
    const BAD_DHGEX: number;
    const OLD_EXIT: number;
    const DYN_RPORT_BUG: number;
    const BUG_DHGEX_LARGE: number;
}
export const DEFAULT_KEX: string[];
export const SUPPORTED_KEX: string[];
export const DEFAULT_SERVER_HOST_KEY: string[];
export const SUPPORTED_SERVER_HOST_KEY: string[];
export const DEFAULT_CIPHER: string[];
export const SUPPORTED_CIPHER: string[];
export const DEFAULT_MAC: string[];
export const SUPPORTED_MAC: string[];
export const DEFAULT_COMPRESSION: string[];
export const SUPPORTED_COMPRESSION: string[];
export const curve25519Supported: boolean;
export const eddsaSupported: boolean;
export declare namespace MESSAGE {
    const DISCONNECT: number;
    const IGNORE: number;
    const UNIMPLEMENTED: number;
    const DEBUG: number;
    const SERVICE_REQUEST: number;
    const SERVICE_ACCEPT: number;
    const KEXINIT: number;
    const NEWKEYS: number;
    const KEXDH_INIT: number;
    const KEXDH_REPLY: number;
    const KEXDH_GEX_GROUP: number;
    const KEXDH_GEX_INIT: number;
    const KEXDH_GEX_REPLY: number;
    const KEXDH_GEX_REQUEST: number;
    const KEXECDH_INIT: number;
    const KEXECDH_REPLY: number;
    const USERAUTH_REQUEST: number;
    const USERAUTH_FAILURE: number;
    const USERAUTH_SUCCESS: number;
    const USERAUTH_BANNER: number;
    const USERAUTH_PASSWD_CHANGEREQ: number;
    const USERAUTH_PK_OK: number;
    const USERAUTH_INFO_REQUEST: number;
    const USERAUTH_INFO_RESPONSE: number;
    const GLOBAL_REQUEST: number;
    const REQUEST_SUCCESS: number;
    const REQUEST_FAILURE: number;
    const CHANNEL_OPEN: number;
    const CHANNEL_OPEN_CONFIRMATION: number;
    const CHANNEL_OPEN_FAILURE: number;
    const CHANNEL_WINDOW_ADJUST: number;
    const CHANNEL_DATA: number;
    const CHANNEL_EXTENDED_DATA: number;
    const CHANNEL_EOF: number;
    const CHANNEL_CLOSE: number;
    const CHANNEL_REQUEST: number;
    const CHANNEL_SUCCESS: number;
    const CHANNEL_FAILURE: number;
}
export declare namespace DISCONNECT_REASON {
    const HOST_NOT_ALLOWED_TO_CONNECT: number;
    const PROTOCOL_ERROR: number;
    const KEY_EXCHANGE_FAILED: number;
    const RESERVED: number;
    const MAC_ERROR: number;
    const COMPRESSION_ERROR: number;
    const SERVICE_NOT_AVAILABLE: number;
    const PROTOCOL_VERSION_NOT_SUPPORTED: number;
    const HOST_KEY_NOT_VERIFIABLE: number;
    const CONNECTION_LOST: number;
    const BY_APPLICATION: number;
    const TOO_MANY_CONNECTIONS: number;
    const AUTH_CANCELED_BY_USER: number;
    const NO_MORE_AUTH_METHODS_AVAILABLE: number;
    const ILLEGAL_USER_NAME: number;
}
export declare const DISCONNECT_REASON_STR: undefined;
export declare namespace CHANNEL_OPEN_FAILURE_1 {
    const ADMINISTRATIVELY_PROHIBITED: number;
    const CONNECT_FAILED: number;
    const UNKNOWN_CHANNEL_TYPE: number;
    const RESOURCE_SHORTAGE: number;
}
export declare namespace TERMINAL_MODE {
    const TTY_OP_END: number;
    const VINTR: number;
    const VQUIT: number;
    const VERASE: number;
    const VKILL: number;
    const VEOF: number;
    const VEOL: number;
    const VEOL2: number;
    const VSTART: number;
    const VSTOP: number;
    const VSUSP: number;
    const VDSUSP: number;
    const VREPRINT: number;
    const VWERASE: number;
    const VLNEXT: number;
    const VFLUSH: number;
    const VSWTCH: number;
    const VSTATUS: number;
    const VDISCARD: number;
    const IGNPAR: number;
    const PARMRK: number;
    const INPCK: number;
    const ISTRIP: number;
    const INLCR: number;
    const IGNCR: number;
    const ICRNL: number;
    const IUCLC: number;
    const IXON: number;
    const IXANY: number;
    const IXOFF: number;
    const IMAXBEL: number;
    const ISIG: number;
    const ICANON: number;
    const XCASE: number;
    const ECHO: number;
    const ECHOE: number;
    const ECHOK: number;
    const ECHONL: number;
    const NOFLSH: number;
    const TOSTOP: number;
    const IEXTEN: number;
    const ECHOCTL: number;
    const ECHOKE: number;
    const PENDIN: number;
    const OPOST: number;
    const OLCUC: number;
    const ONLCR: number;
    const OCRNL: number;
    const ONOCR: number;
    const ONLRET: number;
    const CS7: number;
    const CS8: number;
    const PARENB: number;
    const PARODD: number;
    const TTY_OP_ISPEED: number;
    const TTY_OP_OSPEED: number;
}
export declare namespace CHANNEL_EXTENDED_DATATYPE {
    const STDERR: number;
}
export declare const SIGNALS: {};
export declare const COMPAT_CHECKS: ((string | number)[] | (number | RegExp)[])[];
export declare const DISCONNECT_REASON_BY_VALUE: {};
export { CHANNEL_OPEN_FAILURE_1 as CHANNEL_OPEN_FAILURE };