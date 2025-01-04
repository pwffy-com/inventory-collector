import type {
    GetFunctionCommandInput,
    GetFunctionCommandOutput,
    ListFunctionsCommandOutput
} from '@aws-sdk/client-lambda'
import {GetFunctionCommand, LambdaClient, paginateListFunctions,} from '@aws-sdk/client-lambda'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _lambda extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'Lambda',
                'call': 'ListFunctions',
                'permission': 'ListFunctions',
                'initiator': true,
            },
        ]
    }


    GetFunction = (FunctionName: string) => {

        const handler = (data: GetFunctionCommandOutput) => {

            this.catcher(data, this.region, this.service, 'GetFunction' as TSdkCmd)
        }

        const sdkcmd = getMyName()
        const config: GetFunctionCommandInput = {
            FunctionName,
        }

        const cmd = new GetFunctionCommand(config)

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListFunctions = () => {

        const pConfig = {
            client: this.client as LambdaClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListFunctions(pConfig, {})

        const handler = (page: ListFunctionsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'ListFunctions' as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_lambda}
