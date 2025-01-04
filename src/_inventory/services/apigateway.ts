import type {
    GetMethodCommandOutput,
    GetResourcesCommandOutput,
    GetRestApisCommandOutput,
} from '@aws-sdk/client-api-gateway'
import {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetRestApis,
} from '@aws-sdk/client-api-gateway'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
// import type {AwsCredentialIdentity} from '@aws-sdk/types'
// import type {TCatcher} from '../index'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

// import {RuntimeConfigIdentityProvider} from "@aws-sdk/types/dist-types/identity/AwsCredentialIdentity"

class _apigateway extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'APIGateway',
                'call': 'GetRestApis',
                'permission': 'GET',
                'initiator': true,
            },
            {
                'service': 'APIGateway',
                'call': 'GetResources',
                'permission': 'GET',
                'initiator': false,
            },
            {
                'service': 'APIGateway',
                'call': 'GetMethod',
                'permission': 'GET',
                'initiator': false,
            },
        ]
    }


    GetMethod = (restApiId: string, httpMethod: string, resourceId: string) => {

        const _input = {
            httpMethod,
            resourceId,
            restApiId,
        }

        const sdkcmd = getMyName()
        const cmd = new GetMethodCommand(_input)

        const handler = (output: GetMethodCommandOutput) => {

            this.catcher(output, this.region, this.service, 'GetMethod' as TSdkCmd, resourceId)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    GetResources = (restApiId: string) => {

        const pConfig = {
            client: this.client as APIGatewayClient,
            pageSize: 500,
        }

        const cmdParams = {
            restApiId,
        }

        const sdkcmd = getMyName()
        const paginator = paginateGetResources(pConfig, cmdParams)

        const handler = (page: GetResourcesCommandOutput) => {

            // this.catcher._handle(page, this, 'GetResources')
            const _p: Promise<unknown>[] = []

            if (page.items) {

                // const _ids = page.items!.map((_item) => {
                //     return `${restApiId},${_item.id}`
                // })
                this.catcher(page.items, this.region, this.service, 'GetResources' as TSdkCmd, restApiId)

                page.items.forEach((resource) => {

                    if (resource.resourceMethods) {

                        Object.keys(resource.resourceMethods).forEach((METHOD) => {

                            if (resource.id) _p.push(this.GetMethod(restApiId, METHOD, resource.id))
                        })
                    }
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    GetRestApis = () => {

        const pConfig = {
            client: this.client as APIGatewayClient,
            pageSize: 500,
        }

        const sdkcmd = getMyName()
        const paginator = paginateGetRestApis(pConfig, {})

        const handler = (page: GetRestApisCommandOutput) => {

            // this.catcher(page, this.region, this.service, 'GetRestApis')
            const _p: Promise<unknown>[] = []

            if (page.items) {

                // const _ids = page.items!.map((_item) => {
                //     return _item.id!
                // })
                this.catcher(page.items, this.region, this.service, 'GetRestApis' as TSdkCmd)

                page.items.forEach((item) => {

                    if (item.id) _p.push(this.GetResources(item.id))
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_apigateway}
