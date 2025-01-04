import type {
    DescribeActivityCommandOutput,
    DescribeStateMachineCommandOutput,
    ListActivitiesCommandOutput,
    ListStateMachinesCommandOutput,
} from '@aws-sdk/client-sfn'
import {
    DescribeActivityCommand,
    DescribeStateMachineCommand,
    paginateListActivities,
    paginateListStateMachines,
    SFNClient,
} from '@aws-sdk/client-sfn'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _sfn extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'SFN',
                'call': 'ListActivities',
                'permission': 'ListActivities',
                'initiator': true,
            },
            // {
            //   "service": "SFN",
            //   "call": "ListExecutions",
            //   "permission": "ListExecutions",
            //   "initiator": true,
            // },
            {
                'service': 'SFN',
                'call': 'DescribeActivity',
                'permission': 'DescribeActivity',
                'initiator': false,
            },
            {
                'service': 'SFN',
                'call': 'DescribeStateMachine',
                'permission': 'DescribeStateMachine',
                'initiator': false,
            },
            {
                'service': 'SFN',
                'call': 'ListStateMachines',
                'permission': 'ListStateMachines',
                'initiator': true,
            },
        ]
    }


    DescribeActivity = (activityArn: string) => {

        const _config = {
            activityArn,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeActivityCommand(_config)

        const handler = (data: DescribeActivityCommandOutput) => {

            this.catcher(data, this.region, this.service, 'DescribeActivity' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    DescribeStateMachine = (stateMachineArn: string) => {

        const _config = {
            stateMachineArn,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeStateMachineCommand(_config)

        const handler = (data: DescribeStateMachineCommandOutput) => {

            this.catcher(data, this.region, this.service, 'DescribeStateMachine' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListActivities = () => {

        const pConfig = {
            client: this.client as SFNClient,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListActivities(pConfig, {})

        const handler = (page: ListActivitiesCommandOutput) => {

            // this.catcher._handle(page, this, 'ListActivities')
            const _p: Promise<unknown>[] = []

            if (page.activities) {

                // const _ids = page.activities!.map((_item) => {
                //     return _item.name!
                // })
                this.catcher(page.activities, this.region, this.service, 'ListActivities' as TSdkCmd)

                page.activities.forEach((activity) => {

                    if (activity.activityArn) {

                        _p.push(
                            this.DescribeActivity(activity.activityArn)
                        )
                    }
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    ListStateMachines = () => {

        const pConfig = {
            client: this.client as SFNClient,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListStateMachines(pConfig, {})

        const handler = (page: ListStateMachinesCommandOutput) => {

            // this.catcher._handle(page, this, 'ListStateMachines')
            const _p: Promise<unknown>[] = []
            if (page.stateMachines) {

                // const _ids = page.stateMachines!.map((_item) => {
                //     return _item.name!
                // })
                this.catcher(page.stateMachines, this.region, this.service, 'ListStateMachines' as TSdkCmd)

                page.stateMachines.forEach((item) => {

                    if (item.stateMachineArn) {

                        _p.push(
                            this.DescribeStateMachine(item.stateMachineArn)
                        )
                    }
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_sfn}
