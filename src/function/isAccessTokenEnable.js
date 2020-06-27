// id_tokenの生存確認

function isAccessTokenEnable(state) {

    if (state.id_token && state.id_token.exp) {
        var time = Math.round((new Date()).getTime() / 1000);
        // console.log(state.id_token.exp, time)
        if (state.id_token.exp < time) {
            return false
        }
        else {
            return true
        }
    }
}

export default isAccessTokenEnable;

