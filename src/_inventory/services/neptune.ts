import {DescribeDBClustersCommandOutput, NeptuneClient, paginateDescribeDBClusters} from '@aws-sdk/client-neptune'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _neptune extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'Neptune',
                'call': 'ListFunctions',
                'permission': 'ListFunctions',
                'initiator': true,
            },
        ]
    }


    DescribeDBClusters = () => {

        const pConfig = {
            client: this.client as NeptuneClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBClusters(pConfig, {})

        const handler = (page: DescribeDBClustersCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeDBClusters' as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_neptune}