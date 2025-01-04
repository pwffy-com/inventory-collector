import type {
    GetPolicyCommandOutput,
    GetPolicyVersionCommandOutput,
    GetUserPolicyCommandOutput,
    ListPoliciesCommandInput,
    ListPoliciesCommandOutput,
    ListRolesCommandOutput,
    ListUserPoliciesCommandOutput,
    ListUsersCommandOutput,
    Policy,
    User,
} from '@aws-sdk/client-iam'
import {
    GetPolicyCommand,
    GetPolicyVersionCommand,
    GetUserPolicyCommand,
    IAMClient,
    paginateListPolicies,
    paginateListRoles,
    paginateListUserPolicies,
    paginateListUsers,
} from '@aws-sdk/client-iam'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

class _iam extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'IAM',
                'call': 'GetUserPolicy',
                'permission': 'GetUserPolicy',
                'initiator': false,
            },
            {
                'service': 'IAM',
                'call': 'ListUserPolicies',
                'permission': 'ListUserPolicies',
                'initiator': false,
            },
            {
                'service': 'IAM',
                'call': 'ListUsers',
                'permission': 'ListUsers',
                'initiator': true,
            },
            {
                'service': 'IAM',
                'call': 'GetPolicyVersion',
                'permission': 'GetPolicyVersion',
                'initiator': false,
            },
            {
                'service': 'IAM',
                'call': 'GetPolicy',
                'permission': 'GetPolicy',
                'initiator': false,
            },
            {
                'service': 'IAM',
                'call': 'ListPolicies',
                'permission': 'ListPolicies',
                'initiator': true,
            },
            {
                'service': 'IAM',
                'call': 'ListRoles',
                'permission': 'ListRoles',
                'initiator': true,
            },
        ]
    }


    GetUserPolicy = (user: User, PolicyName: string) => {

        const UserName = user.UserName

        const oParams = {
            PolicyName,
            UserName,
        }

        const sdkcmd = getMyName()
        const cmd = new GetUserPolicyCommand(oParams)

        const handler = (data: GetUserPolicyCommandOutput) => {

            this.catcher(data, this.region, this.service, 'GetUserPolicy' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }

    ListUserPolicies = (user: User) => {

        const pConfig = {
            client: this.client as IAMClient,
            pageSize: 100,
        }

        const cmdParams = {
            UserName: user.UserName,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListUserPolicies(pConfig, cmdParams)

        const handler = (page: ListUserPoliciesCommandOutput) => {

            // this.catcher._handle(page, this, 'ListUserPolicies')
            const _p: Promise<unknown>[] = []

            if (page.PolicyNames) {

                // const _ids = page.PolicyNames!.map((_item) => {
                //     return _item!
                // })

                this.catcher(page.PolicyNames, this.region, this.service, 'ListUserPolicies' as TSdkCmd)

                page.PolicyNames.forEach((policyName) => {

                    _p.push(
                        this.GetUserPolicy(user, policyName)
                    )
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    GetPolicyVersion = (policy: Policy) => {

        const PolicyArn = policy.Arn
        const VersionId = policy.DefaultVersionId
        const oParams = {
            PolicyArn,
            VersionId,
        }

        const sdkcmd = getMyName()
        const cmd = new GetPolicyVersionCommand(oParams)

        const handler = (data: GetPolicyVersionCommandOutput) => {

            this.catcher(data, this.region, this.service, 'GetPolicyVersion' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    GetPolicy = (policy: Policy) => {

        const PolicyArn = policy.Arn
        const oParams = {
            PolicyArn,
        }

        const sdkcmd = getMyName()
        const cmd = new GetPolicyCommand(oParams)

        const handler = (data: GetPolicyCommandOutput) => {

            const _p: Promise<unknown>[] = []
            this.catcher(data, this.region, this.service, 'GetPolicy' as TSdkCmd)
            if (data.Policy) {

                _p.push(
                    this.GetPolicyVersion(data.Policy)
                )
            }
            return Promise.all(_p)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListPolicies = () => {

        const pConfig = {
            client: this.client as IAMClient,
            pageSize: 200,
        }

        const cmdParams: ListPoliciesCommandInput = {
            Scope: 'Local',
        }

        const sdkcmd = getMyName()
        const paginator = paginateListPolicies(pConfig, cmdParams)

        const handler = (page: ListPoliciesCommandOutput) => {

            // this.catcher._handle(page, this, 'ListPolicies')
            const _p: Promise<unknown>[] = []

            if (page.Policies) {

                // const _ids = page.Policies!.map((_item) => {
                //     return _item.PolicyId!
                // })
                this.catcher(page.Policies, this.region, this.service, 'ListPolicies' as TSdkCmd)

                page.Policies.forEach((policy) => {

                    _p.push(
                        this.GetPolicy(policy)
                    )
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }


    ListRoles = () => {

        const pConfig = {
            client: this.client as IAMClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListRoles(pConfig, {})

        const handler = (page: ListRolesCommandOutput) => {

            // this.catcher(page, this, 'ListRoles')
            if (page.Roles) {

                // const _ids = page.Roles!.map((_item) => {
                //     return _item.RoleId!
                // })
                this.catcher(page.Roles, this.region, this.service, 'ListRoles' as TSdkCmd)
            }
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }

    ListUsers = () => {

        const pConfig = {
            client: this.client as IAMClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListUsers(pConfig, {})

        const handler = (page: ListUsersCommandOutput) => {

            // this.catcher(page, this, this.service, 'ListUsers')
            const _p: Promise<unknown>[] = []
            if (page.Users) {

                // const _ids = page.Users!.map((_item) => {
                //     return _item.UserId!
                // })

                this.catcher(page.Users, this.region, this.service, 'ListUsers' as TSdkCmd)

                page.Users.forEach((user) => {

                    _p.push(
                        this.ListUserPolicies(user)
                    )
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_iam}
