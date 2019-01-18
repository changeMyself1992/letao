/// <reference path="D:/2018web/12.移动web视频(共120多集)/移动web项目/letao/typings/index.d.ts" />
$(function() {
    $(".mui-input-group").on("submit", function(e) {
        //阻止默认提交
        e.preventDefault();
        var data = LeTao.serialize2object($(this).serialize());
        if (!data.password || !data.username) {
            mui.toast('请输入用户名和密码');
            return false
        }
        //开始登录
        LeTao.ajax({
            url: "/user/login",
            data: data,
            success: function(data) {
                console.log(data);
                if (data.error == 403) {
                    mui.toast('用户名不存在。');
                    return false
                }
                var returnUrl = location.search.substr(1).substr(10);
                console.log(returnUrl);
                //如果有传过来的地址 跳回
                if (returnUrl) {
                    location.href = returnUrl;
                } else {
                    //如果没有 跳回首页
                    location.href = "http://localhost:3000/m/index.html";
                }
            }
        });
    });
});