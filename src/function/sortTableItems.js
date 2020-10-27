
/**
 * itemsをフィルターし、tableItemを返す
 * @param {object} items 全アイテム
 * @return {object} テーブルに表示するアイテム 
 */
function sortTableItems(items, sort_key, order) {

    // ソート
    let tableItems = items.sort((a, b) => {
        // 昇順
        if (order === "asc") {
            if (a[sort_key] > b[sort_key]) return 1
            if (a[sort_key] < b[sort_key]) return -1
            return 0
        } else {
            // 降順
            if (a[sort_key] > b[sort_key]) return -1
            if (a[sort_key] < b[sort_key]) return 1
            return 0
        }
    });

    // 項番'#'振り直し
    let count = 0
    tableItems.forEach(tableitem => {
        tableitem['#'] = ++count
    });
    return tableItems
}

export default sortTableItems;