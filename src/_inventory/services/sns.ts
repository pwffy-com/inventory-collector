import type {
    GetSubscriptionAttributesCommandOutput,
    GetTopicAttributesCommandOutput,
    ListSubscriptionsCommandOutput,
    ListTopicsCommandOutput,
} from '@aws-sdk/client-sns'
import {
    GetSubscriptionAttributesCommand,
    GetTopicAttributesCommand,
    paginateListSubscriptions,
    paginateListTopics,
    SNSClient,
} from '@aws-sdk/client-sns'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _sns extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'SNS',
                'call': 'GetTopicAttributes',
                'permission': 'GetTopicAttributes',
                'initiator': false,
            },
            {
                'service': 'SNS',
                'call': 'ListTopics',
                'permission': 'ListTopics',
                'initiator': true,
            },
            {
                'service': 'SNS',
                'call': 'GetSubscriptionAttributes',
                'permission': 'GetSubscriptionAttributes',
                'initiator': false,
            },
            {
                'service': 'SNS',
                'call': 'ListSubscriptions',
                'permission': 'ListSubscriptions',
                'initiator': true,
            },
        ]
    }


    GetSubscriptionAttributes = (SubscriptionArn: string) => {

        const _input = {
            SubscriptionArn,
        }

        const sdkcmd = getMyName()
        const cmd = new GetSubscriptionAttributesCommand(_input)

        const handler = (data: GetSubscriptionAttributesCommandOutput) => {

            this.catcher(data, this.region, this.service, 'GetSubscriptionAttributes' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListSubscriptions = () => {

        const pConfig = {
            client: this.client as SNSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListSubscriptions(pConfig, {})

        const handler = (page: ListSubscriptionsCommandOutput) => {

            // this.catcher._handle(page, this, 'ListSubscriptions')
            const _p: Promise<unknown>[] = []

            if (page.Subscriptions) {

                // const _ids = page.Subscriptions!.map((_item) => {
                //     return _item.SubscriptionArn!
                // })
                this.catcher(page.Subscriptions, this.region, this.service, 'ListSubscriptions' as TSdkCmd)

                page.Subscriptions.forEach((subscription) => {

                    if (subscription.SubscriptionArn) {

                        _p.push(
                            this.GetSubscriptionAttributes(subscription.SubscriptionArn)
                        )
                    }
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    GetTopicAttributes = (TopicArn: string) => {

        const _input = {
            TopicArn,
        }

        const sdkcmd = getMyName()
        const cmd = new GetTopicAttributesCommand(_input)

        const handler = (data: GetTopicAttributesCommandOutput) => {

            this.catcher(data, this.region, this.service, 'GetTopicAttributes' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListTopics = () => {

        const pConfig = {
            client: this.client as SNSClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListTopics(pConfig, {})

        const handler = (page: ListTopicsCommandOutput) => {

            // this.catcher._handle(page, this, 'ListTopics')
            const _p: Promise<unknown>[] = []

            if (page.Topics) {

                // const _ids = page.Topics!.map((_item) => {
                //     return _item.TopicArn!
                // })
                this.catcher(page.Topics, this.region, this.service, 'ListTopics' as TSdkCmd)

                page.Topics.forEach((topic) => {

                    if (topic.TopicArn) {

                        _p.push(
                            this.GetTopicAttributes(topic.TopicArn)
                        )
                    }
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_sns}
