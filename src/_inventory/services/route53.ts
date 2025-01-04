import type {ListHostedZonesCommandOutput,} from '@aws-sdk/client-route-53'
import {paginateListHostedZones, Route53Client} from '@aws-sdk/client-route-53'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _route53 extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'Route53',
                'call': 'ListHostedZones',
                'permission': 'ListHostedZones',
                'initiator': true,
            },
        ]
    }


    ListHostedZones = () => {

        const pConfig = {
            client: this.client as Route53Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListHostedZones(pConfig, {})

        const handler = (page: ListHostedZonesCommandOutput) => {

            this.catcher(page, this.region, this.service, 'ListHostedZones' as TSdkCmd)
            // const _ids = page.HostedZones!.map((_item) => {
            //     return _item.Id!
            // })
            // if (page.HostedZones) this.catcher._handle(page.HostedZones, this, 'ListHostedZones')
            // this.catcher._handle(page, this, 'ListHostedZones')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_route53}
