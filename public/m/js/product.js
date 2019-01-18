/// <reference path="D:/2018web/12.移动web视频(共120多集)/移动web项目/letao/typings/index.d.ts" />

$(function() {
    var productId = LeTao.getParamsByUrl().productId;
    if (productId) {
        queryProduct(productId, function(data) {
            console.log(data);
            //渲染页面
            $(".mui-scroll").html(template("detail", data));
            //启用轮播图
            mui('.mui-slider').slider({
                interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            //把加载中禁用
            $("span.fa.fa-spinner").hide();
            //滑动区域初始化
            mui('.mui-scroll-wrapper').scroll({
                indicators: true, //是否显示滚动条
            });
            //1.尺码的选择
            var size = -1;
            $(".btn_size").on("tap", function() {
                $(this).addClass("now").siblings().removeClass("now");
                size = $.trim($(this).text());
                console.log(size);
            });
            //2.数量的选择
            var num = -1;
            $(".p_number span").on("tap", function() {
                var currNum = $(this).siblings("input").val();
                if ($(this).hasClass("jian")) {
                    if (currNum == 0) return
                    currNum--;
                } else {
                    if (currNum >= data.num) return
                    currNum++;
                }
                $(this).siblings("input").val(currNum);
                num = currNum;
            });
            //3.加入购物车
            $(".btn_addCart").on("tap", function() {
                // 数据检验
                if (!num || !size) {
                    mui.toast('请选择尺码和商品数量！');
                    return false
                }
                //提交数据
                var options = {
                    url: "/cart/addCart",
                    type: "post",
                    data: {
                        productId: productId,
                        num: num,
                        size: size
                    },
                    dataType: "json",
                    success: function(data) {
                        //添加成功跳转购物车界面
                        console.log(data);
                        mui.toast('已添加到购物车!');
                    }
                }
                LeTao.ajax(options);
            });
        });
    }
});


//根据id 拿到商品详情
function queryProduct(productid, callback) {
    $.ajax({
        url: "/product/queryProductDetail",
        type: "get",
        data: { id: productid },
        dataType: "json",
        success: function(data) {
            if (callback) {
                callback(data);
            }
        }
    });
};