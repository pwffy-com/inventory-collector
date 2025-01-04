import type {
    DescribeCacheClustersCommandOutput,
    DescribeCacheSubnetGroupsCommandOutput,
    DescribeReplicationGroupsCommandOutput,
} from '@aws-sdk/client-elasticache'
import {
    ElastiCacheClient,
    paginateDescribeCacheClusters,
    paginateDescribeCacheSubnetGroups,
    paginateDescribeReplicationGroups,
} from '@aws-sdk/client-elasticache'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _elasticache extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'ElastiCache',
                'call': 'DescribeCacheClusters',
                'permission': 'DescribeCacheClusters',
                'initiator': true,
            },
            {
                'service': 'ElastiCache',
                'call': 'DescribeReplicationGroups',
                'permission': 'DescribeReplicationGroups',
                'initiator': true,
            },
            {
                'service': 'ElastiCache',
                'call': 'DescribeCacheSubnetGroups',
                'permission': 'DescribeCacheSubnetGroups',
                'initiator': true,
            },
        ]
    }


    DescribeCacheClusters = () => {

        const pConfig = {
            client: this.client as ElastiCacheClient,
            pageSize: 100,
        }

        const cmdParams = {
            ShowCacheNodeInfo: true,
            ShowCacheClustersNotInReplicationGroups: true,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeCacheClusters(pConfig, cmdParams)

        const handler = (page: DescribeCacheClustersCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeCacheClusters' as TSdkCmd)
            // const _ids = page.CacheClusters!.map((_item) => {
            //     return _item.CacheClusterId!
            // })
            // if (page.CacheClusters) this.catcher._handle(page.CacheClusters, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeCacheSubnetGroups = () => {

        const pConfig = {
            client: this.client as ElastiCacheClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeCacheSubnetGroups(pConfig, {})

        const handler = (page: DescribeCacheSubnetGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeCacheSubnetGroups' as TSdkCmd)
            // const _ids = page.CacheSubnetGroups!.map((_item) => {
            //     return _item.CacheSubnetGroupName!
            // })
            // if (page.CacheSubnetGroups) this.catcher._handle(page.CacheSubnetGroups, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeReplicationGroups = () => {

        const pConfig = {
            client: this.client as ElastiCacheClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeReplicationGroups(pConfig, {})

        const handler = (page: DescribeReplicationGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeReplicationGroups' as TSdkCmd)
            // const _ids = page.ReplicationGroups!.map((_item) => {
            //     return _item.ReplicationGroupId!
            // })
            // if (page.ReplicationGroups) this.catcher._handle(page.ReplicationGroups, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_elasticache}
