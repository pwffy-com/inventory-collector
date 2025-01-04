import type {
    DescribeAutoScalingGroupsCommandOutput,
    DescribeLaunchConfigurationsCommandOutput,
} from '@aws-sdk/client-auto-scaling'
import {
    AutoScalingClient,
    paginateDescribeAutoScalingGroups,
    paginateDescribeLaunchConfigurations,
} from '@aws-sdk/client-auto-scaling'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _autoscaling extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'AutoScaling',
                'call': 'DescribeLaunchConfigurations',
                'permission': 'DescribeLaunchConfigurations',
                'initiator': true,
            },
            {
                'service': 'AutoScaling',
                'call': 'DescribeAutoScalingGroups',
                'permission': 'DescribeAutoScalingGroups',
                'initiator': true,
            },
        ]
    }


    DescribeAutoScalingGroups = () => {

        const pConfig = {
            client: this.client as AutoScalingClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeAutoScalingGroups(pConfig, {})

        const handler = (page: DescribeAutoScalingGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeAutoScalingGroups' as TSdkCmd)
            // const _ids = page.AutoScalingGroups!.map((_item) => {
            //     return _item.AutoScalingGroupName!
            // })
            // if (page.AutoScalingGroups) this.catcher._handle(page.AutoScalingGroups, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeLaunchConfigurations = () => {

        const pConfig = {
            client: this.client as AutoScalingClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeLaunchConfigurations(pConfig, {})

        const handler = (page: DescribeLaunchConfigurationsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeLaunchConfigurations' as TSdkCmd)
            // const _ids = page.LaunchConfigurations!.map((_item) => {
            //     return _item.LaunchConfigurationName!
            // })
            // if (page.LaunchConfigurations) this.catcher._handle(page.LaunchConfigurations, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_autoscaling}
