import AWS from 'aws-sdk';
import { OUTPUT_LABELS, IDENTITY_POOL_ID, GET_PERMISSION_URL } from '../config/config'

var apigClientFactory = require('../../node_modules/aws-api-gateway-client').default;
AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
});

/**
 * 
 * @param {XXX} state XXX
 * @param {XXX} client_config XXX
 * @param {XXX} csv_flag XXX
 */
async function fetchData(num, searchType, login_state, csv_flag = false) {

    // 検索モードによってAPIを変更する
    let url = GET_PERMISSION_URL + 'prototype';
    // if (csv_flag) url += 'csv';
    // else if (searchType === "owner") url += 'owner';
    // else if (searchType === "user") url += 'user';
    // else if (searchType === "folder") url += 'folder';

    // CSV 出力指定の時は行数を 0 で指定
    var localstate = {
        "id": login_state.searchText,
        "type": searchType,
        "sort": login_state.sort,
        "order": login_state.order,
        "page": num,
        "rows": csv_flag === true ? 0 : login_state.rowsParPage
    }
    console.log('localstate')
    console.log(localstate)

    login_state.client_config.invokeUrl = url;

    var apigClient = apigClientFactory.newClient(login_state.client_config);

    var pathParams = {};
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams = {
        // queryParams: localstate
    }
    var body = {}

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function (result) {
            console.log(result)
            let state = modeling(result.data, searchType)
            return state

        }).catch(function (result) {
            console.log('API Gateway reply Error.')
            console.log(result)
            login_state.items = [];
            login_state.error = result;
            login_state.show_dialog = true;
            console.log(login_state)
            return login_state;
        });
}

// Dynamo の JSON から内部用 JSON リストに成形
function modeling(response, searchType) {
    var response_data = response.csv_datas;

    var result = [];
    var rows = [];
    var count = 0;
    var type = '#' + searchType
    console.log(type)
    var labels = OUTPUT_LABELS['screen'][type]

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
    // console.log(Object.keys(result.items).length)
    return result

}


// // Dynamo の JSON から内部用 JSON リストに成形
// function modeling(data, state, csv_flag, searchType) {
//     var items = data.items;

//     var rows = [];
//     var count = 0;

//     var labels = [];
//     let result = data.query;
//     if (csv_flag === true) {
//         labels = state.type === 'owner' ? OUTPUT_LABELS['csv']['#owner'] : OUTPUT_LABELS['csv']['#user']
//         result.items = data.items
//     }
//     else {
//         labels = state.type === 'owner' ? OUTPUT_LABELS['screen']['#owner'] : OUTPUT_LABELS['screen']['#user']
//         items.forEach(item => {
//             var col = {};
//             col['#'] = ++count;
//             for (var value in item) {
//                 if (item[value] === "True") {
//                     col[value] = "●";
//                 } else if (item[value] === "False") {
//                     col[value] = "";
//                 } else {
//                     col[value] = item[value];
//                 }
//             }

//             col = swapColumns(col, labels)  // 列を指定ラベル順に変更

//             rows.push(col);
//         });

//         result.items = rows;
//     }

//     // 検索時のqueryと返ってきたqueryをマージ
//     result.type = searchType;
//     result.id = data.query.id;
//     result.sort = state.sort;
//     result.order = state.order;
//     result.loading = false;
//     result.error = null;
//     console.log(result);
//     console.log(Object.keys(result.items).length)

//     return result;
// }


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
