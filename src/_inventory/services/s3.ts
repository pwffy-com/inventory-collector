import axios from 'axios'
import sha256 from 'sha256'
import crypto from 'crypto-js'
// import QR from "../queueRunner"
import type {Bucket,} from '@aws-sdk/client-s3'
import {AwsService} from "./index"
import {TSdkCmd} from '../..'

export type TS3BucketListing = {
    [_region: string]: {
        Buckets: Bucket[]
    }
}

class _s3 extends AwsService {

    static getPerms = () => {
        return [
            {
                'service': 'S3',
                'call': 'ListBuckets',
                'permission': 'ListAllMyBuckets',
                'initiator': true,
            },
        ]
    }


    ListBuckets = () => {

        const AWS_SIG_VER = 'aws4_request'
        const AWS_ACCESS_KEY_ID = this.credentials.accessKeyId
        const AWS_SECRET_ACCESS_KEY = this.credentials.secretAccessKey

        const AWSS3HOSTNAME = 's3.amazonaws.com'


        const getSignatureKey = (key: string, dateStamp: string, regionName: string, serviceName: string, signatureVer: string) => {
            const kDate = crypto.HmacSHA256(dateStamp, 'AWS4' + key)
            const kRegion = crypto.HmacSHA256(regionName, kDate)
            const kService = crypto.HmacSHA256(`${serviceName}`, kRegion)
            return crypto.HmacSHA256(signatureVer, kService)
        }


        const getS3HashedCanonicalRequest = (httpMethod: string, canonicalUri: string, signedHeaders: string[], queryString: string, canonicalHeaders: string[], hashed_payload: string) => {

            // let timestamp = `${TS}\n`
            const method = `${httpMethod}\n`
            const uri = `${canonicalUri}\n`
            const query_string = `${queryString}\n`


            let canonical_headers = ''
            canonicalHeaders.forEach((header) => {
                canonical_headers += `${header}\n`
            })
            canonical_headers += `\n`


            let signed_headers = ''
            signedHeaders.forEach((header_name, i) => {
                if (i === 0) {
                    signed_headers = header_name
                } else {

                    signed_headers += `;${header_name}`
                }
            })
            // signed_headers += `\n`

            // let str = `${method}${uri}${query_string}${canonical_headers}${host}${date_header}${signed_headers}${hashed_payload}`
            const str = `${method}${uri}${query_string}${canonical_headers}${signed_headers}\n${hashed_payload}`

            const hash = sha256(str)
            return [hash, signed_headers]

        }


        // const bucket = ``
        const strUri = ''
        const canonicalUri = `/${encodeURIComponent(strUri)}`


        const serviceName = 's3'
        const HttpRequestMethod = 'GET'
        const canonicalQueryString = ''
        const signedHeaders = [
            'host',
            'x-amz-content-sha256',
            'x-amz-date',
        ]


        const e = new Date()
        const year = `${e.getUTCFullYear()}`
        const month = `0${e.getUTCMonth() + 1}`.slice(-2)
        const date = `0${e.getUTCDate()}`.slice(-2)
        const hours = `0${e.getUTCHours()}`.slice(-2)
        const minutes = `0${e.getUTCMinutes()}`.slice(-2)
        const seconds = `0${e.getUTCSeconds()}`.slice(-2)
        const TS = `${year}${month}${date}T${hours}${minutes}${seconds}Z`


        const hashed_payload = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        const canonicalHeaders = [
            `host:${AWSS3HOSTNAME}`,
            `x-amz-content-sha256:${hashed_payload}`,
            `x-amz-date:${TS}`,
        ]


        const regionName = 'us-east-1'
        const shortDate = `${year}${month}${date}`
        const Algorithm = `AWS4-HMAC-SHA256`
        const RequestDateTime = `${TS}\n`
        const CredentialScope = `${shortDate}/${regionName}/${serviceName}/${AWS_SIG_VER}`
        const [HashedCanonicalRequest, signed_headers_crafted] = getS3HashedCanonicalRequest(
            HttpRequestMethod,
            canonicalUri,
            signedHeaders,
            canonicalQueryString,
            canonicalHeaders,
            hashed_payload,
        )
        const StringToSign = `${Algorithm}\n${RequestDateTime}${CredentialScope}\n${HashedCanonicalRequest}`


        const signingKey = getSignatureKey(AWS_SECRET_ACCESS_KEY, shortDate, regionName, serviceName, AWS_SIG_VER)
        const signature = crypto.HmacSHA256(StringToSign, signingKey)


        const signature_str = `Signature=${signature}`
        const signed_headers_str = `SignedHeaders=${signed_headers_crafted}`
        const credential_str = `Credential=${AWS_ACCESS_KEY_ID}/${CredentialScope}`
        const authorization = `${Algorithm} ${credential_str}, ${signed_headers_str}, ${signature_str}`


        const url = `https://${AWSS3HOSTNAME}/`
        const config = {
            headers: {
                'X-Amz-Date': TS,
                'X-Amz-Content-SHA256': hashed_payload,
                'Host': AWSS3HOSTNAME,
                'Authorization': authorization,
            },
        }

        const someObj = {
            url,
            config,
        }

        const blob = Buffer.from(JSON.stringify(someObj)).toString('base64')

        // resolve(blob)
        if (this.s3HelperUrl) {
            return axios.post(this.s3HelperUrl, {
                blob,
            }, {})
                .then((response) => {

                    const b64Resp = response.data
                    const responseData = Buffer.from(b64Resp.data, 'base64').toString('ascii')
                    const objResponseData = JSON.parse(responseData)
                    const obj = {
                        [this.region]: {
                            Buckets: [...objResponseData.ListAllMyBucketsResult.Buckets.Bucket],
                        },
                    }

                    // const _ids = (objResponseData.ListAllMyBucketsResult.Buckets as Bucket[]).map((_item) => {
                    //     return _item.Name!
                    // })
                    if (this.catcher) this.catcher(obj as TS3BucketListing, this.region, this.service, 'ListBuckets' as TSdkCmd)
                    // this.catcher.handle(obj as TS3BucketListing, this)

                    // return obj
                    return Promise.resolve(true)
                })
                .catch((e) => {

                    return Promise.reject(e)
                })
        } else {

            // return Promise.reject(new Error(`No s3 helper available.`))
            return Promise.reject(new Error(`No s3 helper available.`))
        }
    }
}

export {_s3}
