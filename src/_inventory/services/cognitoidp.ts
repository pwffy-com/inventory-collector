import type {
    ListGroupsCommandOutput,
    ListUserPoolsCommandInput,
    ListUserPoolsCommandOutput,
    ListUsersCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import {
    CognitoIdentityProviderClient,
    paginateListGroups,
    paginateListUserPools,
    paginateListUsers,
} from '@aws-sdk/client-cognito-identity-provider'
import {type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

class _cognitoidp extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'CognitoIdentityProviderV2',
                'call': 'ListUserPools',
                'permission': 'ListUserPools',
                'initiator': true,
            },
            {
                'service': 'CognitoIdentityProviderV2',
                'call': 'ListUsers',
                'permission': 'ListUsers',
                'initiator': false,
            },
            {
                'service': 'CognitoIdentityProviderV2',
                'call': 'ListGroups',
                'permission': 'ListGroups',
                'initiator': false,
            },
        ]
    }


    ListGroups = (UserPoolId: string) => {

        const pConfig = {
            client: this.client as CognitoIdentityProviderClient,
            pageSize: 60,
        }

        const cmdParams = {
            UserPoolId,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListGroups(pConfig, cmdParams)

        const handler = (page: ListGroupsCommandOutput) => {

            this.catcher(page, this.region, this.service, 'ListGroups' as TSdkCmd)
            // const _ids = page.Groups!.map((_item) => {
            //     return _item.GroupName!
            // })
            // if (page.Groups) this.catcher._handle(page.Groups, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    ListUsers = (UserPoolId: string) => {

        const pConfig = {
            client: this.client as CognitoIdentityProviderClient,
            pageSize: 60,
        }

        const cmdParams = {
            UserPoolId,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListUsers(pConfig, cmdParams)

        const handler = (page: ListUsersCommandOutput) => {

            this.catcher(page, this.region, this.service, 'ListUsers' as TSdkCmd)
            // const _ids = page.Users!.map((_item) => {
            //     return _item.Username!
            // })
            // if (page.Users) this.catcher._handle(page.Users, this, '')
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    ListUserPools = () => {

        const pConfig = {
            client: this.client as CognitoIdentityProviderClient,
            pageSize: 60,
        }

        const _input: ListUserPoolsCommandInput = {
            MaxResults: 60,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListUserPools(pConfig, _input)

        const handler = (page: ListUserPoolsCommandOutput) => {

            // this.catcher._handle(page, this, 'ListUserPools')
            const _p: Promise<unknown>[] = []

            if (page.UserPools) {

                // const _ids = page.UserPools!.map((_item) => {
                //     return _item.Id!
                // })
                this.catcher(page.UserPools, this.region, this.service, 'ListUserPools' as TSdkCmd)

                page.UserPools.forEach((userPool) => {

                    if (userPool.Id) {

                        _p.push(
                            this.ListGroups(userPool.Id)
                        )

                        _p.push(
                            this.ListUsers(userPool.Id)
                        )
                    }
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_cognitoidp}
