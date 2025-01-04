import type {GetFunctionCommand, LambdaClient, ListFunctionsCommandOutput,} from '@aws-sdk/client-lambda'
import {
    DescribeAvailabilityZonesCommand,
    type DescribeAvailabilityZonesCommandOutput,
    type DescribeSubnetsCommandOutput,
    type DescribeVolumesCommandOutput,
    type DescribeVpcsCommandOutput,
    EC2Client
} from '@aws-sdk/client-ec2'
import type {Paginator} from '@smithy/types'
import {
    DescribeActivityCommand,
    type DescribeActivityCommandOutput,
    DescribeStateMachineCommand,
    type DescribeStateMachineCommandOutput,
    type ListActivitiesCommandOutput,
    type ListStateMachinesCommandOutput,
    SFNClient
} from "@aws-sdk/client-sfn"
import {GetQueueAttributesCommand, type ListQueuesCommandOutput, SQSClient} from "@aws-sdk/client-sqs"
import {GetSubscriptionAttributesCommand, GetTopicAttributesCommand, SNSClient} from "@aws-sdk/client-sns"
import {type ListHostedZonesCommandOutput} from "@aws-sdk/client-route-53"
import {
    GetPolicyCommand,
    GetPolicyVersionCommand,
    GetUserPolicyCommand,
    type GetUserPolicyCommandOutput,
    IAMClient,
    type ListUserPoliciesCommandOutput,
    type ListUsersCommandOutput
} from "@aws-sdk/client-iam"
import {APIGatewayClient, GetMethodCommand} from "@aws-sdk/client-api-gateway"
import {
    AutoScalingClient,
    type DescribeAutoScalingGroupsCommandOutput,
    type DescribeLaunchConfigurationsCommandOutput
} from "@aws-sdk/client-auto-scaling"
import {CognitoIdentityProviderClient} from '@aws-sdk/client-cognito-identity-provider'
import {CloudWatchClient} from "@aws-sdk/client-cloudwatch"
import {CloudFrontClient, ListCachePoliciesCommand} from "@aws-sdk/client-cloudfront"
import {DescribeTableCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb"
import {ECRClient} from "@aws-sdk/client-ecr"
import {
    DescribeClustersCommand,
    DescribeServicesCommand,
    DescribeTaskDefinitionCommand,
    ECSClient
} from "@aws-sdk/client-ecs"
import {ElastiCacheClient} from "@aws-sdk/client-elasticache"
import {
    DescribeLoadBalancerAttributesCommand,
    ElasticLoadBalancingV2Client
} from "@aws-sdk/client-elastic-load-balancing-v2"
import {ACMClient, DescribeCertificateCommand} from "@aws-sdk/client-acm"
import {type DescribeDBInstancesCommandOutput, type DescribeOptionGroupsCommandOutput} from "@aws-sdk/client-rds"
import {ListDomainNamesCommand, OpenSearchClient} from "@aws-sdk/client-opensearch"
import {_acm} from "./services/acm"
import {_ec2} from "./services/ec2"
import {_rds} from "./services/rds"
import {_autoscaling} from "./services/autoscaling"
import {_apigateway} from "./services/apigateway"
import {_ecr} from "./services/ecr"
import {_ecs} from "./services/ecs"
import {_elasticache} from "./services/elasticache"
import {_elasticloadbalancing} from "./services/elasticloadbalancing"
import {_iam} from "./services/iam"
import {_lambda} from "./services/lambda"
import {_sfn} from "./services/sfn"
import {_s3} from "./services/s3"
import {_sns} from "./services/sns"
import {_sqs} from "./services/sqs"
import {_dynamodb} from "./services/dynamodb"
import {_cloudwatch} from "./services/cloudwatch"
import {_cloudfront} from "./services/cloudfront"
import {_route53} from "./services/route53"
import {_cognitoidp} from "./services/cognitoidp"
import {_opensearch} from "./services/opensearch"
import {_neptune} from "./services/neptune"
import {_elasticsearch} from "./services/elasticsearch"
import {NeptuneClient} from '@aws-sdk/client-neptune'
import { S3Client } from '@aws-sdk/client-s3'
// import ActivityTracker from "../ActivityTracker"
// import {type TClassFile} from "../InventoryCatcher"

let WAIT = 100

const MAXRETRIES = 20

type TPaginator =
    Paginator<DescribeVolumesCommandOutput>
    | Paginator<ListQueuesCommandOutput>
    | Paginator<DescribeCertificateCommand>
    | Paginator<DescribeAvailabilityZonesCommandOutput>
    | Paginator<DescribeActivityCommandOutput>
    | Paginator<DescribeStateMachineCommandOutput>
    | Paginator<DescribeVpcsCommandOutput>
    | Paginator<ListFunctionsCommandOutput>
    | Paginator<ListStateMachinesCommandOutput>
    | Paginator<ListActivitiesCommandOutput>
    | Paginator<GetUserPolicyCommandOutput>
    | Paginator<ListUserPoliciesCommandOutput>
    | Paginator<DescribeAutoScalingGroupsCommandOutput>
    | Paginator<DescribeLaunchConfigurationsCommandOutput>
    | Paginator<ListHostedZonesCommandOutput>
    | Paginator<DescribeOptionGroupsCommandOutput>
    | Paginator<ListUsersCommandOutput>
    | Paginator<DescribeDBInstancesCommandOutput>
    | Paginator<DescribeSubnetsCommandOutput>

type TAwsCmdOutput =
    DescribeVolumesCommandOutput
    | ListQueuesCommandOutput
    | DescribeCertificateCommand
    | DescribeAvailabilityZonesCommandOutput
    | DescribeActivityCommandOutput
    | DescribeStateMachineCommandOutput
    | DescribeVpcsCommandOutput
    | ListFunctionsCommandOutput
    | ListStateMachinesCommandOutput
    | ListActivitiesCommandOutput
    | GetUserPolicyCommandOutput
    | ListUserPoliciesCommandOutput
    | DescribeAutoScalingGroupsCommandOutput
    | DescribeLaunchConfigurationsCommandOutput
    | ListHostedZonesCommandOutput
    | DescribeOptionGroupsCommandOutput
    | ListUsersCommandOutput
    | DescribeDBInstancesCommandOutput
    | DescribeSubnetsCommandOutput

export type TClassFile = _acm
    | _apigateway
    | _autoscaling
    | _cloudfront
    | _cloudwatch
    | _cognitoidp
    | _dynamodb
    | _ec2
    | _ecr
    | _ecs
    | _elasticache
    | _elasticloadbalancing
    | _elasticsearch
    | _iam
    | _lambda
    | _neptune
    | _opensearch
    | _rds
    | _route53
    | _s3
    | _sfn
    | _sns
    | _sqs

export interface IHandlerP {
    (_p: TAwsCmdOutput): void
}

export interface IHandlerC {
    (_d: TAwsCmdOutput, sdkcommand: string): void
}

type TAwsCommand =
    DescribeAvailabilityZonesCommand
    | DescribeActivityCommand
    | DescribeStateMachineCommand
    | GetQueueAttributesCommand
    | GetSubscriptionAttributesCommand
    | GetTopicAttributesCommand
    | GetUserPolicyCommand
    | GetPolicyVersionCommand | DescribeTableCommand
    | DescribeCertificateCommand | GetMethodCommand | ListCachePoliciesCommand
    | DescribeTaskDefinitionCommand
    | DescribeClustersCommand | DescribeServicesCommand
    | DescribeLoadBalancerAttributesCommand | GetPolicyCommand
    | GetFunctionCommand
    | ListDomainNamesCommand

export type TAwsClient =
    EC2Client
    | LambdaClient
    | SFNClient
    | SQSClient
    | SNSClient
    | IAMClient
    | ACMClient
    | APIGatewayClient
    | AutoScalingClient
    | CloudFrontClient
    | CloudWatchClient
    | CognitoIdentityProviderClient
    | DynamoDBClient | ECRClient | ECSClient
    | ElastiCacheClient
    | ElasticLoadBalancingV2Client
    | OpenSearchClient
    | NeptuneClient
    | S3Client

export class QR {

    _queueC: {
        cmd: TAwsCommand
        client: TAwsClient
        handler: IHandlerC
        svcClass: TClassFile
        sdkcommand: string
    }[] = []
    _queueP: {
        paginator: TPaginator
        handler: IHandlerP
        svcClass: TClassFile
        sdkcommand: string
    }[] = []
    running: boolean = false
    _running: boolean = false


    // constructor(
    // ) {
    //
    // }


    static speedup = () => {

        if (WAIT > 16) {

            WAIT = WAIT / 2
        }
    }


    static backoff = () => {

        if (WAIT < 2048) {

            WAIT = WAIT * 2
        }
    }


    static retryRunner = async (
        cmd: TAwsCommand,
        client: TAwsClient,
        handler: IHandlerC,
        svcClass: TClassFile,
        sdkcommand: string,
        attempt: number = 0,
    ) => {

        attempt++

        return new Promise(resolve => setTimeout(resolve, WAIT))
            .then(() => {

                // @ts-ignore
                return client.send(cmd)
            })
            .then((d) => {

                // console.log(206)
                // console.log(d)
                // console.log(sdkcommand)
                // console.log(handler)
                return handler(d, sdkcommand)
            })
            .catch((e: Error) => {

                console.error(e)
                // console.warn(e)
                // console.warn(e.name)
                switch (e.name) {
                    case 'ValidationError':
                    case 'AuthFailure':
                    case 'AccessDenied':
                    case 'UnauthorizedOperation':
                    case 'AccessDeniedException':
                    case 'InvalidClientTokenId':
                    case 'UnrecognizedClientException':
                    case 'AuthorizationError':
                        // case 'TypeError':
                        // console.log(cmd)
                        // console.log(client)
                        // console.log(handler)
                        // console.log(svcClass)
                        // console.log(sdkcommand)
                        console.warn(`${e.name}: will not attempt retry.`)
                        return Promise.resolve(e)

                    default:
                        // console.warn(e.name)
                        // console.warn(Object.keys(e))

                        if (attempt < MAXRETRIES) {

                            QR.backoff()
                            // console.warn(`----------> Mk.707 Retrying, prev error was ${e.name}`)
                            // requestSender(fName, attempt)
                            QR.retryRunner(cmd, client, handler, svcClass, sdkcommand, attempt)
                        } else {

                            console.warn(`Retries exhaused: '${handler}', '${attempt}'`)
                            return Promise.resolve(e)
                        }
                }
            })
    }


    pRun = async (
        paginator: TPaginator,
        handler: IHandlerP,
        svcClass: TClassFile,
        sdkcommand: string,
    ) => {

        const _p: Promise<unknown>[] = []
        for await (const page of paginator) {

            _p.push(
                Promise.resolve(handler(page as TAwsCmdOutput))
            )
        }

        return Promise.allSettled(_p)
            .then(() => {

                // const region = svcClass.region
                // const client = svcClass.client.constructor.name.split('Client')[0]
                // return this.tracker.finished(region, client, sdkcommand)
            })
            .catch((e) => {

                console.error(e)
            })
    }


    exec = () => {

        const _p: Promise<unknown>[] = []

        if (!this.running) {

            this.running = true

            while (this._queueC.length > 0) {

                const {
                    cmd,
                    client,
                    handler,
                    svcClass,
                    sdkcommand,
                } = this._queueC.pop()!

                _p.push(
                    QR.retryRunner(cmd, client, handler, svcClass, sdkcommand)
                )
            }

            this.running = false
        }

        return Promise.all(_p)
    }


    add = (cmd: TAwsCommand, client: TAwsClient, handler: IHandlerC, svcClass: TClassFile, sdkcommand: string) => {

        this._queueC.push({cmd, client, handler, svcClass, sdkcommand})

        return this.exec()
    }


    _exec = () => {

        const _p: Promise<unknown>[] = []

        if (!this._running) {

            this._running = true

            while (this._queueP.length > 0) {

                const {
                    paginator,
                    handler,
                    svcClass,
                    sdkcommand,
                } = this._queueP.pop()!

                _p.push(
                    this.pRun(paginator, handler, svcClass, sdkcommand)
                )
            }

            this._running = false
        }

        return Promise.all(_p)
    }


    _add = (paginator: TPaginator, handler: IHandlerP, svcClass: TClassFile, sdkcommand: string) => {

        this._queueP.push({paginator, handler, svcClass, sdkcommand})

        return this._exec()
    }
}