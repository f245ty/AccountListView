import { OUTPUT_LABELS, DEFAULT_ROWS_PAR_PAGE } from '../config/config'

// Dynamo の JSON から内部用 JSON リストに成形
function modelingData(response, searchType) {
    var response_data = response.datas;

    var result = [];
    var rows = [];
    var count = 0;
    var labels = OUTPUT_LABELS['screen'][searchType]

    response_data.forEach(data => {
        var col = {};
        col['#'] = ++count;
        for (var value in data) {
            col[value] = data[value]
        }
        col = swapColumns(col, labels)  // 列を指定ラベル順に変更
        rows.push(col);
    });

    result.items = rows
    result.is_process = response.is_process
    result.is_folder_path = response.is_folder_path
    result.is_search_permission = response.is_search_permission
    result.is_search_result = response.is_search_result
    // ページ数を算出
    result.pages = Math.ceil(rows.length / DEFAULT_ROWS_PAR_PAGE)
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

export default modelingData;