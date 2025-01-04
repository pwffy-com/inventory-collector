import type {ICatcher} from "../index"
import {TAwsSvc, TRegion, TSdkCmd} from "../../index"
import {QR, TAwsClient} from '../queueRunner'

export class AwsService {

    client
    catcher
    region
    service
    account
    QR
    s3HelperUrl

    constructor(
        client: TAwsClient,
        region: TRegion,
        service: TAwsSvc,
        catcher: ICatcher,
        account: string,
        _QR: QR,
        s3HelperUrl?: string
    ) {

        this.client = client
        this.catcher = catcher
        this.region = region
        this.service = service
        this.account = account
        this.QR = _QR
        this.s3HelperUrl = s3HelperUrl
    }


    getMyName = () => {

        const e = new Error('dummy')
        const stack = e.stack!
            .split('\n')[2]
            // " at functionName ( ..." => "functionName"
            .replace(/^\s+at\s+(.+?)\s.+/g, '$1')
        return stack
    }

    handleOutput = (_d: any, sdkcmd: TSdkCmd) => {

        this.catcher(_d, this.region, this.service, sdkcmd)
    }
}