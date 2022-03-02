import { AgentProtocol } from "./agent.js";
import { BaseAgent } from "./agent.js";
import { createAgent } from "./agent.js";
import { CygwinAgent } from "./agent.js";
import { OpenSSHAgent } from "./agent.js";
import { PageantAgent } from "./agent.js";
import { parseKey } from "./protocol/keyParser.js";
import { flagsToString } from "./protocol/SFTP.js";
import { OPEN_MODE } from "./protocol/SFTP.js";
import { STATUS_CODE } from "./protocol/SFTP.js";
import { stringToFlags } from "./protocol/SFTP.js";
export declare const Client: typeof import("./client.js");
export declare const Server: typeof import("./server.js");
export declare namespace utils {
    export { parseKey };
    export namespace sftp {
        export { flagsToString };
        export { OPEN_MODE };
        export { STATUS_CODE };
        export { stringToFlags };
    }
}
export { AgentProtocol, BaseAgent, createAgent, CygwinAgent, HTTPAgent, HTTPSAgent, OpenSSHAgent, PageantAgent };
