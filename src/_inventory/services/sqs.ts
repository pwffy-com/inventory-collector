import type {
    GetQueueAttributesCommandInput,
    GetQueueAttributesCommandOutput,
    ListQueuesCommandOutput,
    SQSClient,
} from '@aws-sdk/client-sqs'
import {GetQueueAttributesCommand, paginateListQueues,} from '@aws-sdk/client-sqs'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _sqs extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'SQS',
                'call': 'GetQueueAttributes',
                'permission': 'GetQueueAttributes',
                'initiator': false,
            },
            {
                'service': 'SQS',
                'call': 'ListQueues',
                'permission': 'ListQueues',
                'initiator': true,
            },
        ]
    }


    GetQueueAttributes = (QueueUrl: string) => {

        const _input: GetQueueAttributesCommandInput = {
            AttributeNames: [
                'All',
            ],
            QueueUrl,
        }

        const sdkcmd = getMyName()
        const cmd = new GetQueueAttributesCommand(_input)

        const handler = (data: GetQueueAttributesCommandOutput) => {

            this.catcher(data, this.region, this.service, 'GetQueueAttributes' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListQueues = () => {

        const pConfig = {
            client: this.client as SQSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListQueues(pConfig, {})

        const handler = (page: ListQueuesCommandOutput) => {

            // this.catcher(page, this, 'ListQueues')
            const _p: Promise<unknown>[] = []

            if (page.QueueUrls) {

                // const _ids = page.QueueUrls!.map((_item) => {
                //     return _item
                // })
                this.catcher(page.QueueUrls, this.region, this.service, 'ListQueues' as TSdkCmd)

                page.QueueUrls.forEach((queueUrl) => {

                    _p.push(
                        this.GetQueueAttributes(queueUrl)
                    )
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_sqs}
