/**
 * ITCAST WEB
 * Created by zhousg on 2016/12/27.
 */
if (!LeTao) var LeTao = {};
/*常用地址*/
LeTao.LOGIN_URL = '/m/user/login.html';
LeTao.SEARCH_LIST_URL = '/mobile/searchList.html';
LeTao.CART_URL = '/m/cart.html';
LeTao.USER_URL = '/m/user/';

/*全局ajax工具函数*/
LeTao.ajax = function(options) {
    if (!options.url) return false;
    $.ajax({
        url: options.url,
        type: options.type || 'post',
        data: options.data || '',
        dataType: options.dataType || 'json',
        timeout: options.timeout || 50000,
        beforeSend: function() {
            options.beforeSend && options.beforeSend();
        },
        success: function(data) {
            /*400代表未登录*/
            if (data && data.error == '400') {
                window.location.href = LeTao.LOGIN_URL + '?returnUrl=' + decodeURI(location.href);
                return false;
            }
            setTimeout(function() {
                options.success && options.success(data);
            }, 1000);
        },
        error: function(xhr, type, errorThrown) {
            mui.toast('服务繁忙');
            options.error && options.error({ xhr: xhr, type: type, errorThrown: errorThrown });
        }
    });
};
/*
 * 获取当前页面的url数据根据key
 * */
LeTao.getUrlParam = function(key) {
    var strings = location.search.substr(1).split("&");
    var value = null;
    for (var i = 0; i < strings.length; i++) {
        var arr = strings[i].split("=");
        if (arr[0] == key) {
            /*urlcode 转码*/
            value = decodeURI(arr[1]);
            break;
        }
    }
    return value;
};
/*
 * 根据数组中对象数据获取索引
 * */
LeTao.getIndexFromId = function(arr, id) {
    var index = null;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item && item.id == id) {
            index = i;
            break;
        }
    }
    return index;
};
/*
 * 根据数组中对象数据ID获取索引
 * */
LeTao.getObjectFromId = function(arr, id) {
    var object = null;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item && item.id == id) {
            object = item;
            break;
        }
    }
    return object;
};

//返回url get参数对象
LeTao.getParamsByUrl = function() {
        var str = location.search.replace("?", "");
        var iterms = str.split("&");
        var arr, Json = {};
        for (var i = 0; i < iterms.length; i++) {
            arr = iterms[i].split("=");
            Json[arr[0]] = arr[1];
        }
        return Json;
    }
    //fromdata序列化数据转json
LeTao.serialize2object = function(str) {
    var iterms = str.split("&");
    var arr, Json = {};
    for (var i = 0; i < iterms.length; i++) {
        arr = iterms[i].split("=");
        Json[arr[0]] = arr[1];
    }
    return Json;
}