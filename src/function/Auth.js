//セッション取得系で必要なパラメータ
const UserPoolId = '『ユーザプールID』';
const IdPoolId = '『IDプールID』';

//・・・/hogemypage.html#id_token=xxxxx&access_token=xxxxx&・・・の形で来るので分解する関数
getParameterByHash = function (name) {
    var wHash = window.location.hash;   //ハッシュ(#)以降をとる
    wHash = wHash.replace('#', '&');     //↓の処理を使いたいがために#を&に変換するorzorz
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(wHash);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//URL中のパラメータからトークンを取り出し、AWS.config.credentials を設定する
checkSession = function () {
    var widToken = getParameterByHash('id_token');
    $('#message').text(widToken);

    AWS.config.region = 'ap-northeast-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdPoolId,
        Logins: {
            ['cognito-idp.ap-northeast-1.amazonaws.com/' + UserPoolId]: widToken
        }
    });

    AWS.config.credentials.refresh(function (err) {
        if (err) {
            $('#message').text('エラー：' + err + '\n\n' + widToken);
        } else {
            $('#message').text('正常！：アイデンティティ IDはこれです → ' + AWS.config.credentials.identityId);
        }
    });
}