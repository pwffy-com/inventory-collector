import type {DescribeAlarmsCommandOutput} from '@aws-sdk/client-cloudwatch'
import {CloudWatchClient, paginateDescribeAlarms} from '@aws-sdk/client-cloudwatch'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _cloudwatch extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'CloudWatch',
                'call': 'DescribeAlarms',
                'permission': 'DescribeAlarms',
                'initiator': true,
            },
        ]
    }


    DescribeAlarms = () => {

        const pConfig = {
            client: this.client as CloudWatchClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeAlarms(pConfig, {})

        const handler = (page: DescribeAlarmsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeAlarms' as TSdkCmd)
            // if (page.MetricAlarms) {
            //
            //     // const _ids = page.MetricAlarms!.map((_item) => {
            //     //     return _item.AlarmName!
            //     // })
            //     this.catcher._handle(page.MetricAlarms, this, '')
            // }
            // if (page.CompositeAlarms) {
            //
            //     // const _ids = page.CompositeAlarms!.map((_item) => {
            //     //     return _item.AlarmName!
            //     // })
            //     this.catcher._handle(page.CompositeAlarms, this, '')
            // }
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_cloudwatch}
