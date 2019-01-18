$(function() {
    $(".ct_search a").on("click", function() {
        // 跳转searchlist,html,并且戴上关键字
        var key = $.trim($(".ct_search input").val());
        //如果没有关键字 就做提示
        if (!key) {
            //用mui的消息提示
            mui.toast('请输入关键字！', { duration: 'long', type: 'div' });
            return false;
        } else {
            location.href = './searchList.html?key=' + key;
        }
    });
});