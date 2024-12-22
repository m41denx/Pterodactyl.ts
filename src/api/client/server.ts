import {AxiosInstance} from "axios";
import {GenericResponse} from "@/api/base/types";
import {Server, ServerStats} from "@/api/common/types_server";
import {ServerDatabase} from "@/api/client/server_database";
import {ServerFiles} from "@/api/client/server_files";


export class ServerClient {
    r: AxiosInstance
    id: string

    databases: ServerDatabase
    files: ServerFiles

    constructor(requester: AxiosInstance, id: string) {
        this.r = requester
        this.id = id

        this.databases = new ServerDatabase(requester, id)
        this.files = new ServerFiles(requester, id)
    }

    info = async (include?: ("egg" | "subusers")[]): Promise<Server> => {
        const {data} = await this.r.get<GenericResponse<Server, "server">>(`/client/servers/${this.id}`, {
            params: {include: include?.join(",")}
        })
        return data.attributes
    }

    // TODO: Implement Websocket wrapper. DO NOT USE
    websocket = async (): Promise<void> => {
        throw new Error("Not implemented")
    }

    resources = async (): Promise<ServerStats> => {
        const {data} = await this.r.get<GenericResponse<ServerStats, "stats">>(`/client/servers/${this.id}/resources`)
        return data.attributes
    }

    command = async (command: string): Promise<void> => {
        await this.r.post(`/client/servers/${this.id}/command`, {command})
    }

    power = async (signal: "start" | "stop" | "restart" | "kill"): Promise<void> => {
        await this.r.post(`/client/servers/${this.id}/power`, {signal})
    }
}