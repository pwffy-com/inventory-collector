import type {TRegion} from './index'

export const _calls: {
    [_r in TRegion]?: {}
} = {}

const allRegions: TRegion[] = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'sa-east-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-northeast-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'ap-east-1',
    'ap-south-1',
    'ap-south-2',
    'eu-south-1',
    'eu-south-2',
    'me-central-1',
    'me-south-1',
    'il-central-1',
    'ca-central-1',
    'eu-central-1',
    'eu-central-2',
    'af-south-1',
    'eu-north-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
]

export const generate = () => {

    for (const _region of allRegions) {

        _calls[_region] = {
            APIGateway: [
                'GetRestApis',
            ],
            DynamoDB: [
                'ListTables'
            ],
            EC2: [
                'DescribeVpcs',
                'DescribeAvailabilityZones',
                'DescribeSecurityGroups',
                'DescribeVolumes',
                'DescribeRouteTables',
                'DescribeSubnets',
                'DescribeInstances',
            ],
            ElastiCache: [
                'DescribeCacheClusters',
                'DescribeReplicationGroups',
                'DescribeCacheSubnetGroups',
            ],
            ElasticSearch: [
                'ListDomainNames',
            ],
            Lambda: [
                'ListFunctions'
            ],
            Neptune: [
                'DescribeDBClusters',
            ],
            OpenSearch: [
                'ListDomainNames',
            ],
            RDS: [
                'DescribeDBSubnetGroups',
                'DescribeDBParameterGroups',
                'DescribeOptionGroups',
                'DescribeDBClusters',
                'DescribeDBInstances',
                'DescribeDBProxyEndpoints',
                'DescribeDBProxies',
            ],
            SFN: [
                'ListActivities',
                'ListStateMachines',
            ],
            SNS: [
                'ListTopics',
                'ListSubscriptions',
            ],
            SQS: [
                'ListQueues',
            ],
        }

        if (_region === 'us-east-1') {

            _calls[_region] = {
                ..._calls[_region],
                CloudFront: [
                    'ListCachePolicies',
                    'ListDistributions',
                ],
                Iam: [
                    'ListUsers',
                    'ListRoles',
                    'ListPolicies',
                ],
                Route53: [
                    'ListHostedZones',
                ],
            }
        }
    }
}