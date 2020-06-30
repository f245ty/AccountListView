import AWS from 'aws-sdk';
import { OUTPUT_LABELS, IDENTITY_POOL_ID, STATUS_LABEL, GET_CSV_TASKS_URL } from '../config/config'


var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;

AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    // IdentityId: ''
});

async function getCSVTasks(state, client_config, login_account, post_flag = false) {

    var localstate = {}
    localstate["folder_path"] = state.id
    localstate["user_email"] = login_account

    client_config.invokeUrl = GET_CSV_TASKS_URL;
    var apigClient = apigClientFactory.newClient(client_config);
    var pathParams = {};
    var pathTemplate = '';
    var method = 'GET';
    if (post_flag) method = 'POST';
    var additionalParams = {
        queryParams: localstate
    }
    var body = {}
    console.log(localstate)

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (response) {
            console.log(response.data)
            state = modeling(state, response.data)
            return state

        }).catch(function (response) {
            console.log('API Gateway reply Error.')
            console.log(response)
            return response;
        });

}


// Dynamo の JSON から内部用 JSON リストに成形
function modeling(state, response) {
    var response_data = response.csv_datas;
    // console.log(response)

    var result = [];
    var rows = [];
    var count = 0;
    var labels = OUTPUT_LABELS['screen']['#file']
    // console.log(labels)

    response_data.forEach(data => {
        var col = {};
        col['#'] = ++count;
        // console.log(data)
        for (var value in data) {
            if (value === 'process_state') {
                col[value] = STATUS_LABEL[data[value]]
            } else {
                col[value] = data[value]
            }
            // console.log(col)
        }

        col = swapColumns(col, labels)  // 列を指定ラベル順に変更

        rows.push(col);

    });

    // console.log(rows)
    result.items = rows;
    result.is_process = response.is_process;
    result.is_folder_path = response.is_folder_path;
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