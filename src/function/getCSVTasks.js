import AWS from 'aws-sdk';
import { OUTPUT_LABELS, IDENTITY_POOL_ID, GET_CSV_TASKS_URL } from '../config/config'


var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;

AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
});

async function getCSVTasks(searchText, login_state, post_flag=false) {

    var localstate = {}
    localstate["folder_path"] = searchText
    localstate["user_email"] = login_state.login_account

    login_state.client_config.invokeUrl = GET_CSV_TASKS_URL;
    var apigClient = apigClientFactory.newClient(login_state.client_config);
    var pathParams = {};
    var pathTemplate = '';
    var additionalParams = {};
    var body = {};
    var method = 'GET';
    if (post_flag) {
        method = 'POST';
        body = localstate
    }
    console.log(localstate)

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (response) {
            console.log(response.data)
            let state = modeling(response.data)
            console.log('API Gateway Response')
            console.log(state)
            return state

        }).catch(function (response) {
            console.log('API Gateway reply Error.')
            console.log(response)
            return response;
        });

}


// Dynamo の JSON から内部用 JSON リストに成形
function modeling(response) {
    var response_data = response.csv_datas;

    var result = [];
    var rows = [];
    var count = 0;
    var labels = OUTPUT_LABELS['screen']['#file']

    response_data.forEach(data => {
        var col = {};
        col['#'] = ++count;
        for (var value in data) {
            col[value] = data[value]
        }
        col = swapColumns(col, labels)  // 列を指定ラベル順に変更
        rows.push(col);
    });

    result.items = rows;
    result.is_process = response.is_process;
    result.is_folder_path = response.is_folder_path;
    result.is_search_permission = response.is_search_permission
    return result

}

// ラベルの順番を変更
// items: {}
// labels: [] 順番の指定
//
// items に存在しない列があった場合は、強制的に列を追加する
function swapColumns(item, labels) {
    var swapped = {}
    for (let label of labels) swapped[label] = label in item ? item[label] : ""
    return swapped
}

export default getCSVTasks;
