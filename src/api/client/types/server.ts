import {GenericListResponse, GenericResponse} from "@/api/base/types";
import {EggVariable} from "@/api/common/types/egg";
import {ServerSubuser} from "@/api/client/types/server_subuser";
import {FeatureLimits, ServerLimits} from "@/api/common/types/server_limits";
import {Allocation} from "@/api/common/types/server_allocations";

export type Server = {
    server_owner: string,
    identifier: string,
    internal_id?: number,
    uuid: string,
    name: string,
    node: string,
    is_node_under_maintance: boolean,
    nest_id: number,
    egg_id: number,
    sftp_details: {
        ip: string,
        port: number
    },
    description: string,
    limits: ServerLimits,
    invocation: string,
    docker_image: string,
    egg_features: string[] | null,
    feature_limits: FeatureLimits,
    status: unknown,
    is_suspended: boolean,
    is_installing: boolean,
    is_transferring: boolean,
    relationships: {
        allocations: GenericListResponse<GenericResponse<Allocation, "allocation">>,
        variables: GenericListResponse<GenericResponse<EggVariable, "egg_variable">>,
        egg?: GenericResponse<{
            uuid: string,
            name: string
        }, "egg">,
        subusers: GenericListResponse<GenericResponse<ServerSubuser, "server_subuser">>
    }
}


export type ServerStats = {
    current_state: "installing" | "install_failed" | "reinstall_failed" | "suspended"
        | "restoring_backup" | "running" | "stopped",
    is_suspended: boolean,
    resources: ServerResources
}

type ServerResources = {
    memory_bytes: number,
    cpu_absolute: number,
    disk_bytes: number,
    network_tx_bytes: number,
    network_rx_bytes: number,
    uptime: number
}


