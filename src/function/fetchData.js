import AWS from 'aws-sdk';
import { OUTPUT_LABELS, IDENTITY_POOL_ID } from '../config/config'

var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;
AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    // IdentityId: ''
});

/**
 * 
 * @param {XXX} state XXX
 * @param {XXX} client_config XXX
 * @param {XXX} csv_flag XXX
 */
async function fetchData(state, client_config, csv_flag = false) {

    // 検索モードによってAPIを変更する
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";
    if (csv_flag) url = url + 'csv';
    else if (state.type === "owner") url = url + 'owner';
    else if (state.type === "user") url = url + 'user';
    else if (state.type === "folder") url = url + 'folder';
    console.log(state.type)

    // CSV 出力指定の時は行数を 0 で指定
    var localstate = {}
    for (let key in state) localstate[key] = (key === 'rows' && csv_flag === true) ? 0 : state[key]

    client_config.invokeUrl = url;

    var apigClient = apigClientFactory.newClient(client_config);

    var pathParams = {};
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams = {
        queryParams: localstate
    }
    var body = {}

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (result) {
            console.log(result)
            state = modeling(result.data, state, csv_flag)
            return state

        }).catch(function (result) {
            console.log('API Gateway reply Error.')
            console.log(result)
            state.items = [];
            state.error = result;
            state.show_dialog = true;
            console.log(state)
            return state;
        });
}



// Dynamo の JSON から内部用 JSON リストに成形
function modeling(data, state, csv_flag) {
    var items = data.items;

    var rows = [];
    var count = 0;

    var labels = [];
    let result = data.query;
    if (csv_flag === true) {
        labels = state.type === 'owner' ? OUTPUT_LABELS['csv']['#owner'] : OUTPUT_LABELS['csv']['#user']
        result.items = data.items
    }
    else {
        labels = state.type === 'owner' ? OUTPUT_LABELS['screen']['#owner'] : OUTPUT_LABELS['screen']['#user']
        // console.log(OUTPUT_LABELS)
        // console.log(state.type)
        // console.log(OUTPUT_LABELS['screen'])
        // console.log(labels)
        items.forEach(item => {
            var col = {};
            col['#'] = ++count;
            for (var value in item) {
                if (item[value] === "True") {
                    col[value] = "●";
                } else if (item[value] === "False") {
                    col[value] = "";
                } else {
                    col[value] = item[value];
                }
            }

            col = swapColumns(col, labels)  // 列を指定ラベル順に変更

            rows.push(col);
        });

        result.items = rows;
    }

    // 検索時のqueryと返ってきたqueryをマージ
    // 【TODO】リファクタリング
    result.type = state.type;
    result.id = data.query.id;
    result.sort = state.sort;
    result.order = state.order;
    result.loading = false;
    result.error = null;
    console.log(result);

    return result;
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

export default fetchData;
