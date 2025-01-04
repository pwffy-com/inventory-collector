import type {
    DescribeAvailabilityZonesCommandOutput,
    DescribeInstancesCommandOutput,
    DescribeRouteTablesCommandOutput,
    DescribeSecurityGroupsCommandOutput,
    DescribeSubnetsCommandOutput,
    DescribeVolumesCommandOutput,
    DescribeVpcsCommandOutput,
} from '@aws-sdk/client-ec2'
import {
    DescribeAvailabilityZonesCommand,
    EC2Client,
    paginateDescribeInstances,
    paginateDescribeRouteTables,
    paginateDescribeSecurityGroups,
    paginateDescribeSubnets,
    paginateDescribeVolumes,
    paginateDescribeVpcs,
} from '@aws-sdk/client-ec2'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _ec2 extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'EC2',
                'call': 'DescribeVpcs',
                'permission': 'DescribeVpcs',
                'initiator': true,
            },
            {
                'service': 'EC2',
                'call': 'DescribeAvailabilityZones',
                'permission': 'DescribeAvailabilityZones',
                'initiator': true,
            },
            {
                'service': 'EC2',
                'call': 'DescribeSecurityGroups',
                'permission': 'DescribeSecurityGroups',
                'initiator': true,
            },
            {
                'service': 'EC2',
                'call': 'DescribeVolumes',
                'permission': 'DescribeVolumes',
                'initiator': true,
            },
            {
                'service': 'EC2',
                'call': 'DescribeRouteTables',
                'permission': 'DescribeRouteTables',
                'initiator': true,
            },
            {
                'service': 'EC2',
                'call': 'DescribeSubnets',
                'permission': 'DescribeSubnets',
                'initiator': true,
            },
            {
                'service': 'EC2',
                'call': 'DescribeInstances',
                'permission': 'DescribeInstances',
                'initiator': true,
            },
        ]
    }


    DescribeAvailabilityZones = () => {

        const handler = (data: DescribeAvailabilityZonesCommandOutput) => {

            this.catcher(data, this.region, this.service, 'DescribeAvailabilityZones' as TSdkCmd)
            // if (data.AvailabilityZones) {
            //
            //     for (let i = 0; i < data.AvailabilityZones.length; i++) {
            //
            //         this.catcher.handle(data.AvailabilityZones[i], this, 'DescribeAvailabilityZones')
            //     }
            // }
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeAvailabilityZonesCommand({})

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    DescribeRouteTables = () => {

        const pConfig = {
            client: this.client as EC2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeRouteTables(pConfig, {})

        const handler = (page: DescribeRouteTablesCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeRouteTables' as TSdkCmd)
            // const _ids = page.RouteTables!.map((_item) => {
            //     return _item.RouteTableId!
            // })
            // if (page.RouteTables) this.catcher._handle(page.RouteTables, this, 'DescribeRouteTables')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeVolumes = () => {

        const pConfig = {
            client: this.client as EC2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeVolumes(pConfig, {})

        const handler = (page: DescribeVolumesCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeVolumes' as TSdkCmd)
            // const _ids = page.Volumes!.map((_item) => {
            //     return _item.VolumeId!
            // })
            // if (page.Volumes) this.catcher._handle(page.Volumes, this, 'DescribeVolumes')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeVpcs = () => {

        const pConfig = {
            client: this.client as EC2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeVpcs(pConfig, {})

        const handler = (page: DescribeVpcsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeVpcs' as TSdkCmd)
            // const _ids = page.Vpcs!.map((_item) => {
            //     return _item.VpcId!
            // })
            // if (page.Vpcs) this.catcher._handle(page.Vpcs, this, 'DescribeVpcs')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeSubnets = () => {

        const pConfig = {
            client: this.client as EC2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeSubnets(pConfig, {})

        const handler = (page: DescribeSubnetsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeSubnets' as TSdkCmd)
            // const _ids = page.Subnets!.map((_item) => {
            //     return _item.SubnetId!
            // })
            // if (page.Subnets) this.catcher._handle(page.Subnets, this, 'DescribeSubnets')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeInstances = () => {

        const pConfig = {
            client: this.client as EC2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeInstances(pConfig, {})

        const handler = (page: DescribeInstancesCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeInstances' as TSdkCmd)
            // if (page.Reservations) this.catcher._handle(page, this, 'DescribeInstances')
            // if (page.Reservations) {

            // const _ids = page.Reservations!.map((_item) => {
            //     return _item.ReservationId!
            // })

            // page.Reservations.forEach((reservation) => {
            //
            //     if (reservation.Instances) this.catcher._handle(reservation.Instances, this, _ids, 'DescribeInstances')
            // })
            // }
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    DescribeSecurityGroups = () => {

        const pConfig = {
            client: this.client as EC2Client,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateDescribeSecurityGroups(pConfig, {})

        const handler = (page: DescribeSecurityGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'DescribeSecurityGroups' as TSdkCmd)
            // const _ids = page.SecurityGroups!.map((_item) => {
            //     return _item.GroupId!
            // })
            // if (page.SecurityGroups) this.catcher._handle(page.SecurityGroups, this, 'DescribeSecurityGroups')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_ec2}
