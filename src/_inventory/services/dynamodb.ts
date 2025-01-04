import type {DescribeTableCommandOutput, ListTablesCommandOutput,} from '@aws-sdk/client-dynamodb'
import {DescribeTableCommand, DynamoDBClient, paginateListTables,} from '@aws-sdk/client-dynamodb'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _dynamodb extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'DynamoDB',
                'call': 'DescribeTable',
                'permission': 'DescribeTable',
                'initiator': false,
            },
            {
                'service': 'DynamoDB',
                'call': 'ListTables',
                'permission': 'ListTables',
                'initiator': true,
            },
        ]
    }


    DescribeTable = (TableName: string) => {

        const _input = {
            TableName,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeTableCommand(_input)

        const handler = (data: DescribeTableCommandOutput) => {

            this.catcher(data, this.region, this.service, 'DescribeTable' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListTables = () => {

        const pConfig = {
            client: this.client as DynamoDBClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListTables(pConfig, {})

        const handler = (page: ListTablesCommandOutput) => {

            // this.catcher._handle(page, this, 'ListTables')
            const _p: Promise<unknown>[] = []

            if (page.TableNames) {

                // const _ids = page.TableNames!.map((_item) => {
                //     return _item!
                // })
                this.catcher(page.TableNames, this.region, this.service, 'ListTables' as TSdkCmd)

                page.TableNames.forEach((tableName) => {

                    _p.push(
                        this.DescribeTable(tableName)
                    )
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_dynamodb}
