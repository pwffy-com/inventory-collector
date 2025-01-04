import type {ListCachePoliciesCommandOutput, ListDistributionsCommandOutput,} from '@aws-sdk/client-cloudfront'
import {CloudFrontClient, ListCachePoliciesCommand, paginateListDistributions,} from '@aws-sdk/client-cloudfront'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _cloudfront extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'CloudFront',
                'call': 'ListCachePolicies',
                'permission': 'ListCachePolicies',
                'initiator': true,
            },
            {
                'service': 'CloudFront',
                'call': 'ListDistributions',
                'permission': 'ListDistributions',
                'initiator': true,
            },
        ]
    }


    ListCachePolicies = () => {

        const sdkcmd = getMyName()
        const cmd = new ListCachePoliciesCommand({})

        const handler = (data: ListCachePoliciesCommandOutput) => {

            // const _ids = data.CachePolicyList!.Items!.map((_item) => {
            //     return _item!.CachePolicy!.Id!
            // })
            this.catcher(data, this.region, this.service, 'ListCachePolicies' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListDistributions = () => {

        const pConfig = {
            client: this.client as CloudFrontClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListDistributions(pConfig, {})

        const handler = (page: ListDistributionsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'ListDistributions' as TSdkCmd)
            // const _ids = page.DistributionList!.Items!.map((_item) => {
            //     return _item.Id!
            // })
            // if (page.DistributionList) this.catcher._handle(page.DistributionList, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_cloudfront}
