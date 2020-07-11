import AWS from 'aws-sdk';
import { IDENTITY_POOL_ID, GET_S3_URL } from '../config/config'


var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;

AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
});

async function getS3Url(filename, login_state) {
    login_state.client_config.invokeUrl = GET_S3_URL;
    var apigClient = apigClientFactory.newClient(login_state.client_config);
    var pathParams = {};
    var pathTemplate = '';
    var additionalParams = {
        queryParams: {
            "filename": filename
        }
    };
    var body = {};
    var method = 'GET';
    console.log(pathParams)

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (response) {
            console.log('API Gateway Response')
            console.log(response.data.s3_url)
            return response.data.s3_url

        }).catch(function (response) {
            console.log('API Gateway reply Error.')
            console.log(response)
            return response;
        });

}

export default getS3Url;
