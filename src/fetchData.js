import AWS from 'aws-sdk';
var apigClientFactory = require('aws-api-gateway-client').default;

AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:9cd11c18-7668-4ea3-8427-40a8aed8ec94',
    IdentityId: ''
});



async function fetchData(state, csv_flag = false) {
    
    // 検索モードによってAPIを変更する
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";
    if (state.type === "owner") url = url + 'owner';
    else if (state.type === "user") url = url + 'user';

    // CSV 出力指定の時は行数を 0 で指定
    var localstate = {}
    for( let key in state) localstate[key] = (key == 'rows' && csv_flag == true ) ? 0 : state[key]


    // クレデンシャルの取得
    //【TODO】切り出し
    AWS.config.credentials.get((err) => {
        console.log(AWS.config.credentials);
        if(!err)
        {
            console.log('できた');
            console.log(AWS.config.credentials);
        }
        else
        {
            console.log(err)
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
        return modeling(result.data, state);
        //This is where you would put a success callback
    }).catch( function(result){
        //This is where you would put an error callback
        state.items = [];
        return state;
    });
}


// Dynamo の JSON から内部用 JSON リストに成形
function modeling(data, state) {
    var items = data.items;

    var rows = [];
    var count = 0;
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
        rows.push(col);
    });

    // 検索時のqueryと返ってきたqueryをマージ
    let result = data.query;
    result.type = state.type;
    result.id = data.query.id;
    result.sort = state.sort;
    result.order = state.order;
    result.items = rows;
    // console.log(result);
    console.log(result)
    return result;
}

export default fetchData;