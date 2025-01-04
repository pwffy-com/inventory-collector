import type {
    DescribeLoadBalancerAttributesCommandOutput,
    LoadBalancer,
} from '@aws-sdk/client-elastic-load-balancing-v2'
import {
    DescribeLoadBalancerAttributesCommand,
    ElasticLoadBalancingV2Client,
    paginateDescribeLoadBalancers,
} from '@aws-sdk/client-elastic-load-balancing-v2'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import type {DescribeLoadBalancersCommandOutput} from '@aws-sdk/client-auto-scaling'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _elasticloadbalancing extends AwsService {

    static getPerms() {
        return [
            {
                'service': 'ElasticLoadBalancingV2',
                'call': 'DescribeLoadBalancerAttributes',
                'permission': 'DescribeLoadBalancerAttributes',
                'initiator': false,
            },
            {
                'service': 'ElasticLoadBalancingV2',
                'call': 'DescribeLoadBalancers',
                'permission': 'DescribeLoadBalancers',
                'initiator': true,
            },
            {
                'service': 'ElasticLoadBalancingV2',
                'call': 'DescribeTargetGroups',
                'permission': 'DescribeTargetGroups',
                'initiator': false,
            },
        ]
    }


    DescribeLoadBalancerAttributes = (loadbalancer: LoadBalancer) => {

        const _input = {
            LoadBalancerArn: loadbalancer.LoadBalancerArn,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeLoadBalancerAttributesCommand(_input)

        const handler = (data: DescribeLoadBalancerAttributesCommandOutput) => {

            this.catcher(data, this.region, this.service, 'DescribeLoadBalancerAttributes' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    DescribeLoadBalancers = () => {

        const pConfig = {
            client: this.client as ElasticLoadBalancingV2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeLoadBalancers(pConfig, {})

        const handler = (page: DescribeLoadBalancersCommandOutput) => {

            // this.catcher._handle(page, this, 'DescribeLoadBalancers')
            // const _ids = page.LoadBalancers!.map((_item) => {
            //     return _item.LoadBalancerName!
            // })
            this.catcher((page.LoadBalancers as LoadBalancer[]), this.region, this.service, 'DescribeLoadBalancers' as TSdkCmd);

            (page.LoadBalancers as LoadBalancer[]).forEach((loadBalancer: LoadBalancer) => {

                this.DescribeLoadBalancerAttributes(loadBalancer)
            })
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_elasticloadbalancing}
