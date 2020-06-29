/**
 * 
 * @param {XXX} state XXX
 * @param {XXX} csv_flag XXX
 * @return {XXX} XXX
 */
function getQueryString(state, csv_flag) {

    var sort_string;
    // リストの中のソートキーを取得
    if (!state.sort) {
        sort_string = "";
    } else {
        sort_string = Object.keys(state.sort)
    }

    // query_stringを作成
    var query_string = '?id=' + state.id
        + '&sort=' + sort_string
        + '&order=' + state.order
        + '&page=' + state.page
        + '&rows=' + (csv_flag ? 0 : state.rows)
    console.log("query_string :" + query_string);

    return query_string;
}

/**
 * 
 * @param {XXX} state XXX
 * @param {XXX} csv_flag XXX
 * @return {XXX} XXX
 */
async function fetchData(state, csv_flag = false) {

    var query_string = getQueryString(state, csv_flag)

    // 検索モードによってAPIを変更する
    let url = "";
    if (state.type === "owner") {
        url = 'https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/owner';
    } else if (state.type === "user") {
        url = 'https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/user';
    }

    // responseからデータ取得
    return fetch(url + query_string, { mode: 'cors' })
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            // console.log(myJson)
            if (myJson.items) {
                if (myJson.items.message) {
                    // console.info("Not found data. : " + myJson.items.message);
                } else {
                    // console.info("Success!");
                }
                return modeling(myJson, state);
            } else {
                // console.error("Failed to search. : " + myJson.errorType);
                state.items = [];
                return state;
            }

        });
}


/**
 * Dynamo の JSON から内部用 JSON リストに成形
 * @param {XXX} data XXX
 * @param {XXX} state XXX
 * @return {XXX} XXX
 */
function modeling(data, state) {
    if (!data.items.message) {
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
        // console.log("Received");

        // 検索時のqueryと返ってきたqueryをマージ
        let result = data.query;
        result.type = state.type;
        result.id = data.query.id;
        result.sort = state.sort;
        result.order = state.order;
        result.items = rows;
        // console.log(result);
        return result;
    } else {
        data.items = [];
        // console.log("rows = 0 : "+data);
        return data;
    }
}

export default fetchData;
