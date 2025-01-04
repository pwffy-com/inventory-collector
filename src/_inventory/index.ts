import {_acm} from './services/acm'
import {_apigateway} from './services/apigateway'
import {_autoscaling} from './services/autoscaling'
import {_cloudfront} from './services/cloudfront'
import {_cloudwatch} from './services/cloudwatch'
import {_cognitoidp} from './services/cognitoidp'
import {_dynamodb} from './services/dynamodb'
import {_ec2} from './services/ec2'
import {_ecr} from './services/ecr'
import {_ecs} from './services/ecs'
import {_elasticache} from './services/elasticache'
import {_elasticsearch} from './services/elasticsearch'
import {_opensearch} from './services/opensearch'
import {_elasticloadbalancing} from './services/elasticloadbalancing'
import {_iam} from './services/iam'
import {_lambda} from './services/lambda'
import {_neptune} from './services/neptune'
import {_rds} from './services/rds'
import {_route53} from './services/route53'
import type {TS3BucketListing} from './services/s3'
import {_s3} from './services/s3'
import {_sfn} from './services/sfn'
import {_sqs} from './services/sqs'
import {_sns} from './services/sns'
import type {AwsCredentialIdentity} from '@aws-sdk/types'
import {GetCallerIdentityCommand, STSClient} from '@aws-sdk/client-sts'
import {SNSClient, type Subscription, type Topic,} from '@aws-sdk/client-sns'
import {
    type ActivityListItem,
    type DescribeStateMachineCommandOutput,
    SFNClient,
    type StateMachineListItem,
} from '@aws-sdk/client-sfn'
import {
    type DBCluster,
    type DBInstance,
    type DBParameterGroup,
    type DBProxy,
    type DBProxyEndpoint,
    type DBProxyTarget,
    type DBProxyTargetGroup,
    type DBSubnetGroup,
    type OptionGroup,
    RDSClient,
} from '@aws-sdk/client-rds'
import {CognitoIdentityProviderClient, type UserType,} from '@aws-sdk/client-cognito-identity-provider'
import {ECRClient, type Repository,} from '@aws-sdk/client-ecr'
import {type AvailabilityZone, EC2Client, type SecurityGroup, type Vpc,} from '@aws-sdk/client-ec2'
import {
    type DescribeLoadBalancerAttributesCommandOutput,
    ElasticLoadBalancingV2Client,
    type LoadBalancer,
} from '@aws-sdk/client-elastic-load-balancing-v2'
import {CloudWatchClient, type CompositeAlarm, type MetricAlarm,} from '@aws-sdk/client-cloudwatch'
import {CloudFrontClient, type Distribution, type DistributionList,} from '@aws-sdk/client-cloudfront'
import {APIGatewayClient, type RestApi,} from '@aws-sdk/client-api-gateway'
import {ACMClient, CertificateSummary,} from '@aws-sdk/client-acm'
import {AutoScalingClient, type AutoScalingGroup, type LaunchConfiguration,} from '@aws-sdk/client-auto-scaling'
import {type HostedZone, Route53Client} from '@aws-sdk/client-route-53'
import {type GetQueueAttributesCommandOutput, type ListQueuesCommandOutput, SQSClient} from '@aws-sdk/client-sqs'
import {type FunctionConfiguration, LambdaClient,} from '@aws-sdk/client-lambda'
import {type Bucket, S3Client} from '@aws-sdk/client-s3'
import {QR} from "./queueRunner"
import {RuntimeConfigIdentityProvider} from "@aws-sdk/types/dist-types/identity/AwsCredentialIdentity"
import {setAccount, TAwsSvc, TCalls, TRegion, TSdkCmd} from "../index"
import {ElasticsearchServiceClient} from '@aws-sdk/client-elasticsearch-service'
import {OpenSearchClient} from '@aws-sdk/client-opensearch'
import {IAMClient} from '@aws-sdk/client-iam'
import {NeptuneClient} from '@aws-sdk/client-neptune'
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {ECSClient} from '@aws-sdk/client-ecs'
import {ElastiCacheClient} from '@aws-sdk/client-elasticache'

export type TCmdOutput =
// ListTopicsCommandOutput
    UserType[]
    | FunctionConfiguration[]
    | LaunchConfiguration[]
    // | GetPolicyVersionCommandOutput
    | AutoScalingGroup[]
    | CertificateSummary[]
    | RestApi[]
    | Distribution[]
    | DistributionList
    | MetricAlarm[]
    | CompositeAlarm[]
    // | GetTopicAttributesCommandOutput
    // | ListSubscriptionsCommandOutput
    // | GetSubscriptionAttributesCommandOutput
    // | ListHostedZonesCommandOutput
    // | Queue[]
    | ListQueuesCommandOutput
    | GetQueueAttributesCommandOutput
    | DescribeStateMachineCommandOutput
    // | DescribeActivityCommandOutput
    | Topic[]
    | Subscription[]
    | HostedZone[]
    | StateMachineListItem[]
    | ActivityListItem[]
    | string[]
    | Bucket[]
    | TS3BucketListing
    // | GetUserPolicyCommandOutput
    | DBInstance[]
    | DBCluster[]
    | OptionGroup[]
    | DBParameterGroup[]
    | DBSubnetGroup[]
    | DBProxy[]
    | DBProxyEndpoint[]
    | DBProxyTarget[]
    | DBProxyTargetGroup[]
    | SecurityGroup[]
    | AvailabilityZone
    | DescribeLoadBalancerAttributesCommandOutput
    | LoadBalancer
    | Repository[]
    | Vpc[]

// export interface TCatcher {
//     handle(_d: TCmdOutput, _class: TClassFile, subtype: string): void
//
//     _handle(_d: TCmdOutput, _class: TClassFile, subtype: string): void
// }

export interface ICatcher {
    (
        _d: TCmdOutput,
        _region: TRegion,
        _service: TAwsSvc,
        _sdkcmd: TSdkCmd,
        _parent?: string,
    ): void
}

export type TAwsInventory = {
    credentials: AwsCredentialIdentity,
    calls: {
        [region: string]: {
            [service: string]: string[]
        }
    }
    permissions: string[]
    catcher: ICatcher
    cohort: string
    s3HelperUrl: string
}

export class AwsInventory {

    credentials
    permissions: string[]
    catcher
    MAX_WAIT: number | undefined
    s3HelperUrl
    _QR

    constructor(
        credentials: RuntimeConfigIdentityProvider<AwsCredentialIdentity>,
        catcher: ICatcher,
        _QR: QR,
        s3HelperUrl?: string
    ) {

        this.permissions = []
        this.credentials = credentials
        this.catcher = catcher
        this._QR = _QR
        this.s3HelperUrl = s3HelperUrl
    }


    static getPermissions = () => {

        const permissions: {
            service: string,
            call: string,
            permission: string,
            initiator: boolean,
        }[] = []

        const services = [
            '_acm',
            '_apigateway',
            '_autoscaling',
            '_cloudfront',
            '_cloudwatch',
            '_cognitoidp',
            '_dynamodb',
            '_ec2',
            '_ecr',
            '_ecs',
            '_elasticache',
            '_elasticloadbalancing',
            '_iam',
            '_lambda',
            '_rds',
            '_route53',
            '_s3',
            '_sfn',
            '_sns',
            '_sqs',
            '_sts',
        ]
        services.forEach((service) => {

            switch (service) {
                case '_acm':
                    permissions.push(..._acm.getPerms())
                    break
                case '_apigateway':
                    permissions.push(..._apigateway.getPerms())
                    break
                case '_autoscaling':
                    permissions.push(..._autoscaling.getPerms())
                    break
                case '_cloudfront':
                    permissions.push(..._cloudfront.getPerms())
                    break
                case '_cloudwatch':
                    permissions.push(..._cloudwatch.getPerms())
                    break
                case '_cognitoidp':
                    permissions.push(..._cognitoidp.getPerms())
                    break
                case '_dynamodb':
                    permissions.push(..._dynamodb.getPerms())
                    break
                case '_ec2':
                    permissions.push(..._ec2.getPerms())
                    break
                case '_ecr':
                    permissions.push(..._ecr.getPerms())
                    break
                case '_ecs':
                    permissions.push(..._ecs.getPerms())
                    break
                case '_elasticache':
                    permissions.push(..._elasticache.getPerms())
                    break
                case '_elasticloadbalancing':
                    permissions.push(..._elasticloadbalancing.getPerms())
                    break
                case '_iam':
                    permissions.push(..._iam.getPerms())
                    break
                case '_lambda':
                    permissions.push(..._lambda.getPerms())
                    break
                case '_rds':
                    permissions.push(..._rds.getPerms())
                    break
                case '_route53':
                    permissions.push(..._route53.getPerms())
                    break
                case '_s3':
                    permissions.push(..._s3.getPerms())
                    break
                case '_sfn':
                    permissions.push(..._sfn.getPerms())
                    break
                case '_sns':
                    permissions.push(..._sns.getPerms())
                    break
                case '_sqs':
                    permissions.push(..._sqs.getPerms())
                    break
            }
        })

        return permissions
    }


    obtainAccountNumber() {

        const _config = {
            region: 'us-east-1',
            credentials: this.credentials,
        }

        const client = new STSClient(_config)

        return client.send(new GetCallerIdentityCommand({}))
    }


    run(
        region: TRegion,
        _svc: TAwsSvc,
        apiCall: string,
        account: string
    ) {

        const clientConfig = {
            region,
            credentials: this.credentials,
            maxAttempts: 1000,
            retryMode: 'adaptive',
        }

        const acmClient = new ACMClient(clientConfig)
        const apigwClient = new APIGatewayClient(clientConfig)
        const autoscalingClient = new AutoScalingClient(clientConfig)
        const cloudfrontClient = new CloudFrontClient(clientConfig)
        const cloudwatchClient = new CloudWatchClient(clientConfig)
        const cognitoIdpClient = new CognitoIdentityProviderClient(clientConfig)
        const dynamoClient = new DynamoDBClient(clientConfig)
        const ec2Client = new EC2Client(clientConfig)
        const ecrClient = new ECRClient(clientConfig)
        const ecsClient = new ECSClient(clientConfig)
        const elasticacheClient = new ElastiCacheClient(clientConfig)
        const elasticSearchClient = new ElasticsearchServiceClient(clientConfig)
        const openSearchClient = new OpenSearchClient(clientConfig)
        const elbClient = new ElasticLoadBalancingV2Client(clientConfig)
        const iamClient = new IAMClient(clientConfig)
        const lambdaClient = new LambdaClient(clientConfig)
        const neptuneClient = new NeptuneClient(clientConfig)
        const rdsClient = new RDSClient(clientConfig)
        const route53Client = new Route53Client(clientConfig)
        const s3Client = new S3Client(clientConfig)
        const snsClient = new SNSClient(clientConfig)
        const sqsClient = new SQSClient(clientConfig)
        const sfnClient = new SFNClient(clientConfig)

        const _AcmInventory = new _acm(acmClient, region, 'ACM' as TAwsSvc, this.catcher, account, this._QR)
        const _ApiGatewayInventory = new _apigateway(apigwClient, region, 'ApiGw' as TAwsSvc, this.catcher, account, this._QR)
        const _AutoscalingInventory = new _autoscaling(autoscalingClient, region, 'Autoscaling' as TAwsSvc, this.catcher, account, this._QR)
        const _CloudfrontInventory = new _cloudfront(cloudfrontClient, region, 'Cloudfront' as TAwsSvc, this.catcher, account, this._QR)
        const _CloudwatchInventory = new _cloudwatch(cloudwatchClient, region, 'Cloudwatch' as TAwsSvc, this.catcher, account, this._QR)
        const _CognitoidpInventory = new _cognitoidp(cognitoIdpClient, region, 'CognitoIdp' as TAwsSvc, this.catcher, account, this._QR)
        const _DynamodbInventory = new _dynamodb(dynamoClient, region, 'DynamoDb' as TAwsSvc, this.catcher, account, this._QR)
        const _Ec2Inventory = new _ec2(ec2Client, region, 'EC2' as TAwsSvc, this.catcher, account, this._QR)
        const _EcrInventory = new _ecr(ecrClient, region, 'ECR' as TAwsSvc, this.catcher, account, this._QR)
        const _EcsInventory = new _ecs(ecsClient, region, 'ECS' as TAwsSvc, this.catcher, account, this._QR)
        const _ElasticacheInventory = new _elasticache(elasticacheClient, region, 'Elasticache' as TAwsSvc, this.catcher, account, this._QR)
        const _ElasticSearchServiceInventory = new _elasticsearch(elasticSearchClient, region, 'ElasticSearch' as TAwsSvc, this.catcher, account, this._QR)
        const _OpenSearchInventory = new _opensearch(openSearchClient, region, 'OpenSearch' as TAwsSvc, this.catcher, account, this._QR)
        const _ElasticloadbalancingInventory = new _elasticloadbalancing(elbClient, region, 'ELB' as TAwsSvc, this.catcher, account, this._QR)
        const _IamInventory = new _iam(iamClient, region, 'Iam' as TAwsSvc, this.catcher, account, this._QR)
        const _LambdaInventory = new _lambda(lambdaClient, region, 'Lambda' as TAwsSvc, this.catcher, account, this._QR)
        const _NeptuneInventory = new _neptune(neptuneClient, region, 'Neptune' as TAwsSvc, this.catcher, account, this._QR)
        const _RdsInventory = new _rds(rdsClient, region, 'RDS' as TAwsSvc, this.catcher, account, this._QR)
        const _Route53Inventory = new _route53(route53Client, region, 'Route53' as TAwsSvc, this.catcher, account, this._QR)
        const _S3Inventory = new _s3(s3Client, region, 'S3' as TAwsSvc, this.catcher, account, this._QR, this.s3HelperUrl!)
        const _SnsInventory = new _sns(snsClient, region, 'SNS' as TAwsSvc, this.catcher, account, this._QR)
        const _SqsInventory = new _sqs(sqsClient, region, 'SQS' as TAwsSvc, this.catcher, account, this._QR)
        const _StatesInventory = new _sfn(sfnClient, region, 'SFN' as TAwsSvc, this.catcher, account, this._QR)


        // const RETRIES = 2
        const _requestFn = (fName: string) => {

            let fnName
            switch (fName) {

                case 'ACM_ListCertificates':
                    fnName = _AcmInventory.ListCertificates
                    break

                case 'APIGateway_GetRestApis':
                    fnName = _ApiGatewayInventory.GetRestApis
                    break

                // case 'apigateway_GetRestApis':
                //     fnName = _apigateway.apigateway_Begin
                //     // fnName = _apigateway.apigateway_GetRestApis
                //     break

                case 'AutoScaling_DescribeLaunchConfigurations':
                    fnName = _AutoscalingInventory.DescribeLaunchConfigurations
                    break

                case 'AutoScaling_DescribeAutoScalingGroups':
                    fnName = _AutoscalingInventory.DescribeAutoScalingGroups
                    break

                case 'CloudFront_ListCachePolicies':
                    fnName = _CloudfrontInventory.ListCachePolicies
                    break

                case 'CloudFront_ListDistributions':
                    fnName = _CloudfrontInventory.ListDistributions
                    break

                case 'CloudWatch_DescribeAlarms':
                    fnName = _CloudwatchInventory.DescribeAlarms
                    break

                case 'CognitoIdentityProvider_ListUserPools':
                    fnName = _CognitoidpInventory.ListUserPools
                    break

                case 'DynamoDB_ListTables':
                    fnName = _DynamodbInventory.ListTables
                    break

                case 'EC2_DescribeVpcs':
                    fnName = _Ec2Inventory.DescribeVpcs
                    break

                case 'EC2_DescribeAvailabilityZones':
                    fnName = _Ec2Inventory.DescribeAvailabilityZones
                    break

                case 'EC2_DescribeSecurityGroups':
                    fnName = _Ec2Inventory.DescribeSecurityGroups
                    break

                case 'EC2_DescribeVolumes':
                    fnName = _Ec2Inventory.DescribeVolumes
                    break

                case 'EC2_DescribeRouteTables':
                    fnName = _Ec2Inventory.DescribeRouteTables
                    break

                case 'EC2_DescribeSubnets':
                    fnName = _Ec2Inventory.DescribeSubnets
                    break

                case 'EC2_DescribeInstances':
                    fnName = _Ec2Inventory.DescribeInstances
                    break

                case 'ECR_DescribeRepositories':
                    fnName = _EcrInventory.DescribeRepositories
                    break

                case 'ECS_ListClusters':
                    fnName = _EcsInventory.ListClusters
                    break

                case 'ECS_ListTaskDefinitions':
                    fnName = _EcsInventory.ListTaskDefinitions
                    break

                case 'ElastiCache_DescribeCacheClusters':
                    fnName = _ElasticacheInventory.DescribeCacheClusters
                    break

                case 'ElastiCache_DescribeReplicationGroups':
                    fnName = _ElasticacheInventory.DescribeReplicationGroups
                    break

                case 'ElastiCache_DescribeCacheSubnetGroups':
                    fnName = _ElasticacheInventory.DescribeCacheSubnetGroups
                    break

                case 'ElasticSearch_ListDomainNames':
                    fnName = _ElasticSearchServiceInventory.ListDomainNames
                    break

                case 'ElasticLoadBalancingV2_DescribeLoadBalancers':
                    fnName = _ElasticloadbalancingInventory.DescribeLoadBalancers
                    break

                case 'Iam_ListUsers':
                    fnName = _IamInventory.ListUsers
                    break

                case 'Iam_ListPolicies':
                    fnName = _IamInventory.ListPolicies
                    break

                case 'IAM_ListRoles':
                    fnName = _IamInventory.ListRoles
                    break

                case 'Lambda_ListFunctions':
                    fnName = _LambdaInventory.ListFunctions
                    break

                case 'Neptune_DescribeDBClusters':
                    fnName = _NeptuneInventory.DescribeDBClusters
                    break

                case 'OpenSearch_ListDomainNames':
                    fnName = _OpenSearchInventory.ListDomainNames
                    break

                case 'RDS_DescribeDBSubnetGroups':
                    fnName = _RdsInventory.DescribeDBSubnetGroups
                    break

                case 'RDS_DescribeDBParameterGroups':
                    fnName = _RdsInventory.DescribeDBParameterGroups
                    break

                case 'RDS_DescribeOptionGroups':
                    fnName = _RdsInventory.DescribeOptionGroups
                    break

                case 'RDS_DescribeDBClusters':
                    fnName = _RdsInventory.DescribeDBClusters
                    break

                case 'RDS_DescribeDBInstances':
                    fnName = _RdsInventory.DescribeDBInstances
                    break

                case 'RDS_DescribeDBProxies':
                    fnName = _RdsInventory.DescribeDBProxies
                    break

                case 'RDS_DescribeDBProxyEndpoints':
                    fnName = _RdsInventory.DescribeDBProxyEndpoints
                    break

                case 'Route53_ListHostedZones':
                    fnName = _Route53Inventory.ListHostedZones
                    break

                case 'S3_ListBuckets':
                    fnName = _S3Inventory.ListBuckets
                    break

                case 'SNS_ListSubscriptions':
                    fnName = _SnsInventory.ListSubscriptions
                    break

                case 'SNS_ListTopics':
                    fnName = _SnsInventory.ListTopics
                    break

                case 'SQS_ListQueues':
                    fnName = _SqsInventory.ListQueues
                    break

                case 'SFN_ListActivities':
                    fnName = _StatesInventory.ListActivities
                    break

                case 'SFN_ListStateMachines':
                    fnName = _StatesInventory.ListStateMachines
                    break

                // case 'SFN_ListExecutions':
                //   fnName = _sfn.states_ListExecutions
                //   break

                default:
                    return Promise.resolve(`${region}/fName '${fName}' is not an inventory initatior.`)
            }

            if (fnName) return fnName()

            return Promise.resolve(false)
        }


        const strApiCallFn = `${_svc}_${apiCall}`

        switch (_svc as string) {

            case 'S3':
                if (region === 'us-east-1') {

                    return _requestFn(strApiCallFn)
                } else {

                    return Promise.resolve(false)
                }

            case 'CloudFront':
                if (region === 'us-east-1') {

                    return _requestFn(strApiCallFn)
                } else {

                    return Promise.resolve(false)
                }

            case 'Iam':
                if (region === 'us-east-1') {

                    return _requestFn(strApiCallFn)
                } else {

                    return Promise.resolve(false)
                }

            case 'Route53':
                if (region === 'us-east-1') {

                    return _requestFn(strApiCallFn)
                } else {

                    return Promise.resolve(false)
                }

            default:
                return _requestFn(strApiCallFn)
        }
    }


    start = async (calls: TCalls) => {

        let numCalls = 0
        for (const region in calls) {

            for (const service in calls[region as TRegion]) {

                for (const _call in calls[region as TRegion]![service as TAwsSvc]) {

                    numCalls++
                }
            }
        }


        this.MAX_WAIT = Math.floor((numCalls) / 200) * 1000


        return this.obtainAccountNumber()
            .then((Account) => {

                if (Account.Account) setAccount(Account.Account)

                const _p: Promise<unknown>[] = []

                for (const _region in calls) {

                    for (const _service in calls[_region as TRegion]) {

                        for (const _sdkcall of calls[_region as TRegion]![_service as TAwsSvc]!) {

                            if (Account.Account) {

                                _p.push(
                                    this.run(_region as TRegion, _service as TAwsSvc, _sdkcall, Account.Account)
                                )
                            }
                        }
                    }
                }

                return Promise.allSettled(_p)
            })
            .catch((e) => {

                return Promise.resolve(e)
            })
    }
}
