import type {
    CertificateSummary,
    DescribeCertificateCommandOutput,
    ListCertificatesCommandOutput,
} from '@aws-sdk/client-acm'
import {ACMClient, DescribeCertificateCommand, paginateListCertificates,} from '@aws-sdk/client-acm'
// import type {AwsCredentialIdentity} from '@aws-sdk/types'
// import type {TCatcher} from '../index'
import {type IHandlerC, type IHandlerP} from '../queueRunner'
import {getMyName} from "../_helper"
import {AwsService} from "./index"
import {TSdkCmd} from "../../index"

// import {RuntimeConfigIdentityProvider} from "@aws-sdk/types/dist-types/identity/AwsCredentialIdentity"

class _acm extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'ACM',
                'call': 'ListCertificates',
                'permission': 'ListCertificates',
                'initiator': true,
            },
            {
                'service': 'ACM',
                'call': 'DescribeCertificate',
                'permission': 'DescribeCertificate',
                'initiator': false,
            },
        ]
    }


    DescribeCertificate = (cert: CertificateSummary) => {

        const _input = {
            CertificateArn: cert.CertificateArn,
        }

        const sdkcmd = getMyName()
        const cmd = new DescribeCertificateCommand(_input)

        const handler = (data: DescribeCertificateCommandOutput) => {

            // const cloudId = data.Certificate?.CertificateArn
            this.catcher(data, this.region, this.service, 'DescribeCertificate' as TSdkCmd)
        }

        return this.QR.add(cmd, this.client, handler as IHandlerC, this, sdkcmd)
    }


    ListCertificates = () => {

        const pConfig = {
            client: this.client as ACMClient,
            pageSize: 100,
        }

        const sdkcmd = getMyName()
        const paginator = paginateListCertificates(pConfig, {})

        const handler = (page: ListCertificatesCommandOutput) => {

            // this.catcher(page, this, 'ListCertificates')
            const _p: Promise<unknown>[] = []

            if (page.CertificateSummaryList) {

                // const _ids = page.CertificateSummaryList!.map((_item) => {
                //     return _item.CertificateArn!
                // })
                this.catcher(page.CertificateSummaryList, this.region, this.service, 'ListCertificates' as TSdkCmd)

                page.CertificateSummaryList.forEach((cert) => {

                    _p.push(
                        this.DescribeCertificate(cert)
                    )
                })
            }

            return Promise.all(_p)
        }

        return this.QR._add(paginator, handler as IHandlerP, this, sdkcmd)
    }
}

export {_acm}
