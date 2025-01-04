import type {
    DescribeDBClustersCommandOutput,
    DescribeDBInstancesCommandOutput,
    DescribeDBParameterGroupsCommandOutput,
    DescribeDBProxiesCommandOutput,
    DescribeDBProxyEndpointsCommandOutput,
    DescribeDBProxyTargetGroupsCommandOutput,
    DescribeDBProxyTargetsCommandOutput,
    DescribeDBSubnetGroupsCommandOutput,
    DescribeOptionGroupsCommandOutput,
} from '@aws-sdk/client-rds'
import {
    paginateDescribeDBClusters,
    paginateDescribeDBInstances,
    paginateDescribeDBParameterGroups,
    paginateDescribeDBProxies,
    paginateDescribeDBProxyEndpoints,
    paginateDescribeDBProxyTargetGroups,
    paginateDescribeDBProxyTargets,
    paginateDescribeDBSubnetGroups,
    paginateDescribeOptionGroups,
    RDSClient,
} from '@aws-sdk/client-rds'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

// import {TClassFile} from "../../InventoryCatcher.ts"

class _rds extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'RDS',
                'call': 'DescribeDBSubnetGroups',
                'permission': 'DescribeDBSubnetGroups',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBParameterGroups',
                'permission': 'DescribeDBParameterGroups',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeOptionGroups',
                'permission': 'DescribeOptionGroups',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBClusters',
                'permission': 'DescribeDBClusters',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBInstances',
                'permission': 'DescribeDBInstances',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBProxies',
                'permission': 'DescribeDBProxies',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBProxyEndpoints',
                'permission': 'DescribeDBProxyEndpoints',
                'initiator': true,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBProxyTargets',
                'permission': 'DescribeDBProxyTargets',
                'initiator': false,
            },
            {
                'service': 'RDS',
                'call': 'DescribeDBProxyTargetGroups',
                'permission': 'DescribeDBProxyTargetGroups',
                'initiator': false,
            },
        ]
    }


    DescribeDBProxyTargetGroups = (DBProxyName: string) => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const cmdParams = {
            DBProxyName,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBProxyTargetGroups(pConfig, cmdParams)

        const handler = (page: DescribeDBProxyTargetGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBProxyTargets = (DBProxyName: string) => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const cmdParams = {
            DBProxyName,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBProxyTargets(pConfig, cmdParams)

        const handler = (page: DescribeDBProxyTargetsCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBProxyEndpoints = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBProxyEndpoints(pConfig, {})

        const handler = (page: DescribeDBProxyEndpointsCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBProxies = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBProxies(pConfig, {})

        const handler = (page: DescribeDBProxiesCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBSubnetGroups = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBSubnetGroups(pConfig, {})

        const handler = (page: DescribeDBSubnetGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBParameterGroups = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBParameterGroups(pConfig, {})

        const handler = (page: DescribeDBParameterGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeOptionGroups = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeOptionGroups(pConfig, {})

        const handler = (page: DescribeOptionGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBClusters = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBClusters(pConfig, {})

        const handler = (page: DescribeDBClustersCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeDBInstances = () => {

        const pConfig = {
            client: this.client as RDSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeDBInstances(pConfig, {})

        const handler = (page: DescribeDBInstancesCommandOutput) => {

            this.catcher(page, this.region, this.service, sdkcmd as TSdkCmd)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }

}

export {_rds}
