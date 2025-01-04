import type {
    Cluster,
    DescribeClustersCommandInput,
    DescribeClustersCommandOutput,
    DescribeServicesCommandOutput,
    DescribeTaskDefinitionCommandOutput,
    ListClustersCommandOutput,
    ListServicesCommandOutput,
    ListTaskDefinitionsCommandOutput,
} from '@aws-sdk/client-ecs'
import {
    DescribeClustersCommand,
    DescribeServicesCommand,
    DescribeTaskDefinitionCommand,
    ECSClient,
    paginateListClusters,
    paginateListServices,
    paginateListTaskDefinitions,
} from '@aws-sdk/client-ecs'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _ecs extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'ECS',
                'call': 'DescribeServices',
                'permission': 'DescribeServices',
                'initiator': false,
            },
            {
                'service': 'ECS',
                'call': 'ListServices',
                'permission': 'ListServices',
                'initiator': false,
            },
            {
                'service': 'ECS',
                'call': 'DescribeClusters',
                'permission': 'DescribeClusters',
                'initiator': false,
            },
            {
                'service': 'ECS',
                'call': 'ListClusters',
                'permission': 'ListClusters',
                'initiator': true,
            },
            {
                'service': 'ECS',
                'call': 'DescribeTaskDefinition',
                'permission': 'DescribeTaskDefinition',
                'initiator': false,
            },
            {
                'service': 'ECS',
                'call': 'ListTaskDefinitions',
                'permission': 'ListTaskDefinitions',
                'initiator': true,
            },
        ]
    }


    DescribeServices = (cluster: string, services: string[]) => {

        const _input = {
            cluster,
            services,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeServicesCommand(_input)

        const handler = (data: DescribeServicesCommandOutput) => {

            // const _ids = data.services!.map((_item) => {
            //     return _item.serviceName!
            // })
            this.catcher(data, this.region, this.service, 'DescribeServices' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListClusterServices = (cluster: Cluster) => {

        const pConfig = {
            client: this.client as ECSClient,
            pageSize: 100,
        }

        const cmdParams = {
            cluster: cluster.clusterArn,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListServices(pConfig, cmdParams)

        const handler = (page: ListServicesCommandOutput) => {

            // this.catcher._handle(page, this, 'ListClusterServices')
            if (page.serviceArns) {

                // const _ids = page.serviceArns!.map((_item) => {
                //     return _item!
                // })
                this.catcher(page.serviceArns, this.region, this.service, 'ListClusterServices' as TSdkCmd)

                if (cluster.clusterArn) this.DescribeServices(cluster.clusterArn, page.serviceArns)
            }
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeClusters = (clusters: string[]) => {

        const _input: DescribeClustersCommandInput = {
            clusters,
            include: [
                'ATTACHMENTS',
            ],
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeClustersCommand(_input)

        const handler = (data: DescribeClustersCommandOutput) => {

            // const _ids = data.clusters!.map((_item) => {
            //     return _item.clusterName!
            // })
            this.catcher(data, this.region, this.service, 'DescribeClusters' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListClusters = () => {

        const pConfig = {
            client: this.client as ECSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListClusters(pConfig, {})

        const handler = (page: ListClustersCommandOutput) => {

            // this.catcher._handle(page, this, 'ListClusters')
            if (page.clusterArns) {

                // const _ids = page.clusterArns!.map((_item) => {
                //     return _item!
                // })
                this.catcher(page.clusterArns, this.region, this.service, 'ListClusters' as TSdkCmd)

                this.DescribeClusters(page.clusterArns)
            }
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeTaskDefinition = (taskDefinitionArn: string) => {

        const _input = {
            taskDefinition: taskDefinitionArn,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeTaskDefinitionCommand(_input)

        const handler = (data: DescribeTaskDefinitionCommandOutput) => {

            this.catcher(data, this.region, this.service, 'DescribeTaskDefinition' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListTaskDefinitions = () => {

        const pConfig = {
            client: this.client as ECSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListTaskDefinitions(pConfig, {})

        const handler = (page: ListTaskDefinitionsCommandOutput) => {

            // this.catcher._handle(page, this, 'ListTaskDefinitions')
            if (page.taskDefinitionArns) {

                // const _ids = page.taskDefinitionArns!.map((_item) => {
                //     return _item!
                // })
                this.catcher(page.taskDefinitionArns, this.region, this.service, 'ListTaskDefinitions' as TSdkCmd)

                page.taskDefinitionArns.forEach((taskDefinitionArn) => {

                    this.DescribeTaskDefinition(taskDefinitionArn)
                })
            }
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_ecs}
