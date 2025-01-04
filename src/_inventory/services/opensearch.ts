import {ListDomainNamesCommand, ListDomainNamesCommandOutput} from '@aws-sdk/client-opensearch'
import {type IHandlerC} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _opensearch extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'OpenSearch',
                'call': 'ListFunctions',
                'permission': 'ListFunctions',
                'initiator': true,
            },
        ]
    }


    ListDomainNames = () => {

        const handler = (data: ListDomainNamesCommandOutput) => {

            this.catcher(data, this.region, this.service, 'ListDomainNames' as TSdkCmd)
            // if (data.AvailabilityZones) {
            //
            //     for (let i = 0; i < data.AvailabilityZones.length; i++) {
            //
            //         this.catcher.handle(data.AvailabilityZones[i], this, 'DescribeAvailabilityZones')
            //     }
            // }
        }

        const sdkcmd = getMyName()
        const cmd = new ListDomainNamesCommand({})

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }
}

export {_opensearch}
