import {AxiosInstance} from "axios";
import {APIKey, User} from "@/api/client/types";
import {GenericListResponse, GenericResponse} from "@/api/base/types";
import z from "zod";


export class Account {
    r: AxiosInstance

    constructor(requester: AxiosInstance) {
        this.r = requester
    }

    info = async (): Promise<User> => {
        const {data} = await this.r.get<GenericResponse<User, "user">>("/client/account")
        return data.attributes
    }

    updateEmail = async (newEmail: string, password: string): Promise<void> => {
        newEmail = z.string().email().parse(newEmail)
        await this.r.put("/client/account/email", {email: newEmail, password})
    }

    updatePassword = async (password: string, newPassword: string): Promise<void> => {
        await this.r.put("/client/account/password", {
            current_password: password,
            password: newPassword,
            password_confirmation: newPassword
        })
    }

    // Yes, I am mentally insane

    apiKeys = {
        list: async (): Promise<APIKey[]> => {
            const {data} = await this.r.get<
                GenericListResponse<GenericResponse<APIKey, "api_key">>
            >("/client/account/api-keys")
            return data.data.map(k => k.attributes)
        },

        create: async (description: string, allowed_ips?: string[]): Promise<APIKey & { secret_token: string }> => {
            allowed_ips = z.array(z.string().ip()).optional().parse(allowed_ips)
            const {data} = await this.r.post<
                GenericResponse<APIKey, "api_key", { secret_token: string }>
            >("/client/account/api-keys", {description, allowed_ips})
            return {...data.attributes, secret_token: data.meta!.secret_token}
        },

        delete: async (identifier: string): Promise<void> => {
            await this.r.delete(`/client/account/api-keys/${identifier}`)
        }
    }

    twoFactor = {
        info: async (): Promise<{ image_url_data: string }> => {
            const {data} = await this.r.get<
                Awaited<ReturnType<typeof this.twoFactor.info>>
            >("/client/account/two-factor")
            return data
        },

        enable: async (code: string): Promise<{ tokens: string[] }> => {
            const {data} = await this.r.post<
                Awaited<ReturnType<typeof this.twoFactor.enable>>
            >("/client/account/two-factor", {code})
            return data
        },

        disable: async (password: string): Promise<void> => {
            await this.r.delete("/client/account/two-factor", {data: {password}})
        }
    }
}