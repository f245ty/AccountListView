import AWS from 'aws-sdk';
import { IDENTITY_POOL_ID, GET_PERMISSION_URL } from '../config/config'
import modelingData from './modelingData'

var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;
AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
});

/**
 * 
 * @param {XXX} state XXX
 * @param {XXX} login_state XXX
 * @param {XXX} post_flag XXX
 */
async function fetchData(searchType, login_state, post_flag = false) {

    let url = GET_PERMISSION_URL
    let is_all_search_permission = login_state.user_role === "superuser" ? true : false
    var localstate = {
        "process_type": searchType.replace("#", ""),
        "user_email": login_state.login_account,
        "is_all_search_permission": is_all_search_permission
    }

    login_state.client_config.invokeUrl = url;

    var apigClient = apigClientFactory.newClient(login_state.client_config);

    var pathParams = {};
    var pathTemplate = '';
    var additionalParams = {
        queryParams: localstate
    }
    var body = {}
    var method = 'GET';
    if (post_flag) {
        method = 'POST';
        localstate["search_condition"] = login_state.searchText
        body = localstate
    }
    console.log(localstate)

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (result) {
            console.log(result)
            let state = login_state
            state = modelingData(result.data, searchType, is_all_search_permission)
            return state

        }).catch(function (result) {
            console.log('API Gateway reply Error.')
            console.log(result)
            login_state.items = [];
            login_state.error = result;
            login_state.show_dialog = true;
            console.log(login_state)
            return login_state
        });
}

export default fetchData;
