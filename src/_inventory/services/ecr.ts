import type {DescribeRepositoriesCommandOutput} from '@aws-sdk/client-ecr'
import {ECRClient, paginateDescribeRepositories} from '@aws-sdk/client-ecr'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _ecr extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'ECR',
                'call': 'DescribeRepositories',
                'permission': 'DescribeRepositories',
                'initiator': true,
            },
        ]
    }


    DescribeRepositories = () => {

        const pConfig = {
            client: this.client as ECRClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeRepositories(pConfig, {})

        const handler = (page: DescribeRepositoriesCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeRepositories' as TSdkCmd)
            // const _ids = page.repositories!.map((_item) => {
            //     return _item.repositoryName!
            // })
            // if (page.repositories) this.catcher._handle(page.repositories, this, 'DescribeRepositories')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_ecr}
