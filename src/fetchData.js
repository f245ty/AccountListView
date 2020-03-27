import ItemList from './ItemList';
import AWS from 'aws-sdk';
var apigClientFactory = require('../node_modules/aws-api-gateway-client').default;

AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:9cd11c18-7668-4ea3-8427-40a8aed8ec94',
    // IdentityId: ''
});


async function fetchData(state, csv_flag = false) {
    
    // 検索モードによってAPIを変更する
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";
    if (state.type === "owner") url = url + 'owner';
    else if (state.type === "user") url = url + 'user';

    // CSV 出力指定の時は行数を 0 で指定
    var localstate = {}
    for( let key in state) localstate[key] = (key === 'rows' && csv_flag === true ) ? 0 : state[key]


    // クレデンシャルの取得
    //【TODO】切り出し
    AWS.config.credentials.get((err) => {
        if(!err)
        {
        }
        else
        {
        }
    });
    
    var config = {
        invokeUrl: url,
        accessKey: AWS.config.credentials.accessKeyId,
        secretKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        region: 'ap-northeast-1'
    }
    var apigClient = apigClientFactory.newClient(config);
    // apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)

    // ここまで切り出し

    var pathParams = {};
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams = {
        queryParams: localstate
    }
    var body = {}
    
    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
    .then(function(result){
        state = modeling(result.data, state)
        return state

    }).catch( function(result){
        state.items = [];
        return state;
    });
}




// 表示ラベルの順番、ラベルの表示、非表示の設定
const PERMISSION_LABELS = ['p_read', 'p_upload', 'p_download', 'p_delete', 'p_admin']
const OWNER_LABELS = ['owner', 'path', 'folder', 'user_email', 'user_name']
const USER_LABELS = ['path', 'owner', 'folder']


// Dynamo の JSON から内部用 JSON リストに成形
function modeling(data, state) {
    var items = data.items;

    var rows = [];
    var count = 0;

    var labels = state.type == 'owner' ? OWNER_LABELS : USER_LABELS
    labels = labels.concat(PERMISSION_LABELS)

    items.forEach(item => {
        
        var col = {};
        col['#'] = ++count;
        for (var value in item) {
            if (item[value] === "1") {
                col[value] = "●";
            } else if (item[value] === "0") {
                col[value] = "";
            } else {
                col[value] = item[value];
            }
        }

        col = swapColumns(col, labels)  // 列を指定ラベル順に変更

        rows.push(col);
    });

    console.log(rows)

    // 検索時のqueryと返ってきたqueryをマージ
    let result = data.query;
    result.type = state.type;
    result.id = data.query.id;
    result.sort = state.sort;
    result.order = state.order;
    result.items = rows;
    // console.log(result);
    return result;
}


// ラベルの順番を変更
// items: {}
// labels: [] 順番の指定
//
// items に存在しない列があった場合は、強制的に列を追加する
function swapColumns(item , labels){
    var swapped = {}
    for( let label of labels ) swapped[label] = label in item ? item[label] : ""
    return swapped
}



export default fetchData;