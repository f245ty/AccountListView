import AWS from 'aws-sdk';
import { IDENTITY_POOL_ID, GET_CHECK_AUTH } from '../config/config'
import modelingData from './modelingData'

var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;

AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
});

async function getCheckAuth(searchType, login_state) {

    var localstate = {}
    localstate["folder_path"] = login_state.searchText

    login_state.client_config.invokeUrl = GET_CHECK_AUTH;
    var apigClient = apigClientFactory.newClient(login_state.client_config);
    var pathParams = {};
    var pathTemplate = '';
    var additionalParams = {};
    var method = 'POST'
    var body = localstate

    console.log(localstate)

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (response) {
            // console.log(response.data)
            let state = login_state
            state = modelingData(response.data, searchType)
            console.log('API Gateway Response')
            console.log(state)
            return state

        }).catch(function (response) {
            console.log('API Gateway reply Error.')
            console.log(response)
            return response;
        });

}

export default getCheckAuth;
