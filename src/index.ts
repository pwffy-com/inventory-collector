import {fromIni} from "@aws-sdk/credential-provider-ini"
import * as fs from "node:fs"
import {AwsInventory, TCmdOutput} from './_inventory'
import {QR} from './_inventory/queueRunner'
import {RuntimeConfigIdentityProvider} from "@aws-sdk/types/dist-types/identity/AwsCredentialIdentity"
import {AwsCredentialIdentity} from "@aws-sdk/types"
import {_calls, generate} from './calls'
import {GetResourcesCommandOutput} from "@aws-sdk/client-api-gateway"

let profile = ''

if (process.argv.length > 1) {

    for (const i in process.argv) {

        if (process.argv[i] === '--profile') {

            profile = process.argv[Number(i) + 1]
        }
    }
}

export type TRegion = 'us-east-1'
    | 'us-east-2'
    | 'us-west-1'
    | 'us-west-2'
    | 'sa-east-1'
    | 'ap-northeast-3'
    | 'ap-northeast-2'
    | 'ap-northeast-1'
    | 'ap-southeast-1'
    | 'ap-southeast-2'
    | 'ap-southeast-3'
    | 'ap-southeast-4'
    | 'ap-east-1'
    | 'ap-south-1'
    | 'ap-south-2'
    | 'eu-south-1'
    | 'eu-south-2'
    | 'me-central-1'
    | 'me-south-1'
    | 'il-central-1'
    | 'ca-central-1'
    | 'eu-central-1'
    | 'eu-central-2'
    | 'af-south-1'
    | 'eu-north-1'
    | 'eu-west-1'
    | 'eu-west-2'
    | 'eu-west-3'

export type TAwsSvc = 'Acm'
    | 'ApiGateway'
    | 'AutoScaling'
    | 'CloudFront'
    | 'CloudWatch'
    | 'CognitoIdp'
    | 'DynamoDb'
    | 'EC2'
    | 'ECR'
    | 'ECS'
    | 'ElastiCache'
    | 'ElasticLoadBalancing'
    | 'ElasticSearch'
    | 'Iam'
    | 'Lambda'
    | 'Neptune'
    | 'OpenSearch'
    | 'RDS'
    | 'Route53'
    | 'S3'
    | 'SFN'
    | 'SNS'
    | 'SQS'

export type TSdkCmd = 'ListFunctions'
    | 'ListTables'
    | 'GetRestApis'
    | 'GetResources'
    | 'GetMethod'

type TInventoryUpload = {
    account: string
    regions: {
        [region in TRegion]?: {
            [svc in TAwsSvc]?: {
                [sdkcmd in TSdkCmd]?: TCmdOutput[]
            }
        }
    }
    relations: {
        [region in TRegion]?: {
            [svc in TAwsSvc]?: {
                [sdkcmd in TSdkCmd]?: {
                    [child: string]: string
                }
            }
        }
    }
}

export type TCalls = {
    [region in TRegion]?: {
        [svc_name in TAwsSvc]?: string[]
    }
}

const inventory: TInventoryUpload = {
    account: '',
    regions: {},
    relations: {},
}

const writeFile = () => {

    return fs.writeFileSync('./_inventory/inventory.json', JSON.stringify(inventory))
}

const buildCalls = () => {

    generate()

    return _calls
}

export const setAccount = (acccount: string) => {

    inventory.account = acccount
}

const catcher = (
    _d: TCmdOutput,
    _region: TRegion,
    _service: TAwsSvc,
    _sdkcmd: TSdkCmd,
    _parent?: string,
) => {

    if (!inventory.regions[_region]) inventory.regions[_region] = {}
    if (!inventory.regions[_region][_service]) inventory.regions[_region][_service] = {}
    if (!inventory.regions[_region][_service][_sdkcmd]) inventory.regions[_region][_service][_sdkcmd] = []

    if (typeof _d[Symbol.iterator] === 'function') {

        inventory.regions[_region][_service][_sdkcmd] = [..._d]
    } else {

        if (!inventory.regions[_region][_service][_sdkcmd]) inventory.regions[_region][_service][_sdkcmd] = []
        inventory.regions[_region][_service][_sdkcmd].push(_d)
    }

    // relation tracking - cannot resolve parents intrinsically
    if (_parent) {

        if (!inventory.relations[_region]) inventory.relations[_region] = {}
        if (!inventory.relations[_region][_service]) inventory.relations[_region][_service] = {}
        if (!inventory.relations[_region][_service][_sdkcmd]) inventory.relations[_region][_service][_sdkcmd] = {}

        let _child = ''
        if (_service === 'ApiGateway') {


            switch (_sdkcmd) {

                case 'GetResources':
                    for (const _child of (_d as GetResourcesCommandOutput).items!) {

                        inventory.relations[_region][_service][_sdkcmd][_child.id] = _parent
                    }
                    break

                case 'GetMethod':

                    break
            }
        }
        // inventory.relations[_region][_service][_sdkcmd][_child] = _parent
    }
}

class InventoryWrapper {

    start = () => {

        console.log(profile)
        let credentials: RuntimeConfigIdentityProvider<AwsCredentialIdentity> = fromIni({})

        if (profile) {

            credentials = fromIni(
                {
                    profile,
                },
            )
        }

        const _qr = new QR()
        const s3helperurl = 'https://api.pwffy.com/s3helper'
        const awsInventory = new AwsInventory(credentials, catcher, _qr, s3helperurl)

        const calls: TCalls = buildCalls()

        return awsInventory.start(calls)
    }
}

const iw = new InventoryWrapper()

iw.start()
    .then(() => {

        writeFile()
    })
    .then(() => {

        console.log(`Done.`)
    })
    .catch((err) => {

        console.error(err)
    })
