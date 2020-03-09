import AWS from 'aws-sdk';

var apigClientFactory = require('aws-api-gateway-client').default;
var pathParams = {};
var pathTemplate = '';
var method = 'GET';
var additionalParams = {
    queryParams:{
        id: 'msh'
    }
}
var body = {}



AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:9cd11c18-7668-4ea3-8427-40a8aed8ec94',
    IdentityId: ''
});

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

async function fetchData(search_key,sort_key) {
    var config = {
            invokeUrl:'https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/auth/owner',
            accessKey: AWS.config.credentials.accessKeyId,
            secretKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken,
            region: 'ap-northeast-1'
    }
    var apigClient = apigClientFactory.newClient(config);
        
    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
    .then(function(result){
        return result.data.items
        //This is where you would put a success callback
    }).catch( function(result){
        //This is where you would put an error callback
        return []
    });
}

// Dynamo の JSON から内部用 JSON リストに成形
// 【TODO】APIができたので、もう用無し
function modeling(data){
    var items = data.L
    //  ラムダ側で以下の処理を済ませておく
    // 【TODO】行番号を加える処理を入れる
    // 【TODO】ソート処理を入れる
    var rows = [];
    var count = 0;
    items.forEach(item => {
        var col = {};
        col['#'] = ++count;
        for( var value in item.M){
            if( item.M[value].S ){
                col[value] = item.M[value].S;
            }
            if( item.M[value].L );
        }
        rows.push(col);
    });
    return rows;
}

export default fetchData;