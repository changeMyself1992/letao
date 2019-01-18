/// <reference path="D:/2018web/12.移动web视频(共120多集)/移动web项目/letao/typings/index.d.ts" />
$(function() {
    //滑动区域初始化
    var scroll = mui('.mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
    });

    //1.初始化页面
    //初始化上下拉
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true, //可选,默认false.首次加载自动上拉刷新一次
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback: function() {
                    var that = this;
                    getCartData(function(data) {
                        //渲染页面
                        console.log(data);
                        $(".mui-table-view").html(template("cart", data));
                        //停止下拉刷新
                        that.endPulldownToRefresh();
                    });
                }
            }
        }
    });

    //2.编辑功能
    $('body').on('tap', '.mui-btn-blue', function(e) {
        //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
        e.detail.gesture.preventDefault();
        var li = this.parentNode.parentNode;
        //拿到当前点击的商品数据
        var item = LeTao.getObjectFromId(window.data, $(this).attr('data-id'));
        //渲染模板
        var html = template('cartUpdateTpl', { model: item }).replace(/\n/g, ' ');
        console.log(html);
        mui.confirm(html, '编辑商品', ['确定', '取消'], function(e) {
            if (e.index == 0) {
                var params = {
                    id: item.id,
                    size: $('.mui-popup').find('.btn_size.now').html(),
                    num: $('.mui-popup').find('.p_number input').val()
                };
                if (!params.size) {
                    mui.toast('请选择尺码');
                    return false;
                }
                if (!params.num) {
                    mui.toast('请选择数量');
                    return false;
                }
                updateCartData(params, function(data) {
                    if (data.success) {
                        mui.toast('编辑成功');
                        mui.swipeoutClose(li);
                        $.extend(item, params);
                        $(li).find('.number').html('x' + params.num + '双');
                        $(li).find('.size').html('鞋码：' + params.size);
                        setAmount();
                    } else {
                        mui.toast(data.message);
                    }
                });
            } else {
                mui.swipeoutClose(li);
            }
        });
    });
    //尺码选择功能
    $('body').on('tap', '.btn_size', function() {
        var $this = $(this);
        $('.btn_size').removeClass('now');
        $this.addClass('now');

    });
    //加减数量功能
    $('body').on('tap', '.p_number span', function() {
        var $this = $(this),
            $input = $('.p_number input');
        var num = parseInt($input.val()),
            max = $input.attr('data-max');
        if ($this.hasClass('jian')) {
            num > 0 && $input.val(num - 1);
        }
        if ($this.hasClass('jia')) {
            if (num < max) {
                $input.val(num + 1);
            } else {
                mui.toast('没有库存了');
            }
        }
    });

    //3.删除功能
    $('body').on('tap', '.mui-btn-red', function() {
        var li = this.parentNode.parentNode;
        var $this = $(this);
        mui.confirm('你要删除这件商品吗？', '温馨提示', ['确定', '取消'], function(e) {
            if (e.index == 0) {
                deleteCartData({ id: $this.attr('data-id') }, function(data) {
                    if (data.success) {
                        li.parentNode.removeChild(li);
                        setAmount();
                    } else {
                        mui.toast(data.message);
                    }
                });
            } else {
                mui.swipeoutClose(li);
            }
        })
    });


    //4.点击刷新
    $('body').on("tap", ".fa-refresh", function() {
        getCartData(function() {
            //主动调用下拉刷新
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        });
    });

    //5.点击复选框，金额变化
    $('body').on('change', 'input[type="checkbox"]', function() {
        setAmount();
    });

});

//获取购物车数据
function getCartData(callback) {
    LeTao.ajax({
        url: "/cart/queryCartPaging",
        type: "get",
        data: {
            page: 1,
            pageSize: 50,
        },
        success: function(data) {
            if (callback) {
                window.data = data.data;
                callback(data);
            }
        }
    });
}
//更新购物车数据
function updateCartData(params, callback) {
    LeTao.ajax({
        type: 'post',
        url: '/cart/updateCart',
        data: params,
        dataType: 'json',
        success: function(data) {
            callback && callback(data);
        }
    });
};
//删除商品功能
function deleteCartData(params, callback) {
    LeTao.ajax({
        type: 'get',
        url: '/cart/deleteCart',
        dataType: 'json',
        data: params,
        success: function(data) {
            callback && callback(data);
        }
    });
};


//设置订单总额
function setAmount() {
    var amount = 0;
    var checkPro = $('input:checked');
    for (var i = 0; i < checkPro.length; i++) {
        var product = LeTao.getObjectFromId(window.data, $(checkPro[i]).attr('data-id'));
        amount += product.price * product.num;
    }
    $('#cartAmount').html(Math.ceil(amount * 100) / 100);
};