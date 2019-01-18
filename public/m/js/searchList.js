/// <reference path="D:/2018web/12.移动web视频(共120多集)/移动web项目/letao/typings/index.d.ts" />
$(function() {

    //滑动区域初始化
    mui('.mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
    });
    //根据关键字查询 指定页数，的指定数据量
    function queryProduct(params, callback) {
        $.ajax({
            url: "/product/queryProduct",
            type: "get",
            data: params,
            dataType: "json",
            success: function(data) {
                if (callback) {
                    callback(data);
                }
            }
        });
    };
    //1.页面初始化的时候，关键字在输入框内显示
    var getParams = LeTao.getParamsByUrl();
    $(".ct_search input").val(getParams.key || "");
    //2.页面初始化的时候，根据关键字查询第一页数据 4条大小
    queryProduct({ proName: getParams.key, page: 1, pageSize: 4 }, function(data) {
        console.log(data);
        //渲染数据
        $(".ct_product").html(template("list", data));
    });
    //3.用户点击搜索的时候，根据新的关键字搜索商品 重置排序功能
    $(".ct_search a").on("tap", function() {
        var key = $.trim($(".ct_search input").val());
        if (!key) {
            mui.toast("请输入搜索关键字");
            return false;
        }
        queryProduct({ proName: key, page: 1, pageSize: 4 }, function(data) {
            console.log(data);
            //渲染数据
            $(".ct_product").html(template("list", data));
        });
    });
    //4.用户点击排序的时候，根据排序选项去排序
    $(".ct_order a").on("tap", function() {
        //当前点击的a
        var $this = $(this);
        //1.如果之前没有选中
        if (!$this.hasClass("now")) {
            //选中自己，其他的不选中，并把其他的箭头默认朝下
            $this.addClass("now").siblings().removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
        } else {
            //2.如果我当前已经选中了,那就告我当前箭头方向
            if ($this.find("span").hasClass("fa-angle-down"))
                $this.find("span").removeClass("fa-angle-down").addClass("fa-angle-up");
            else
                $this.find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
        //3.获取当前的排序选择
        //当前排序类型
        var selectType = $this.attr("data-type"); //time(上架时间)，price(价格),num(销量),scale(折扣)
        //排序方式 1升序，2降序
        var order = $this.find("span").hasClass("fa-angle-down") ? 2 : 1;
        var params = { proName: getParams.key, page: 1, pageSize: 4 };
        params[selectType] = order;
        //4.再次发请求拿数据
        queryProduct(params, function(data) {
            console.log(data);
            //渲染数据
            $(".ct_product").html(template("list", data));
        });
    });
    //5.下拉刷新功能,根据当前 条件去刷新
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: false, //可选,默认false.首次加载自动上拉刷新一次
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback: function() {
                    var that = this;
                    queryProduct({ proName: getParams.key, page: 1, pageSize: 4 }, function(data) {
                        console.log(that);
                        console.log(mui('#refreshContainer'));
                        $(".ct_product").html(template("list", data));
                        //停止下拉刷新
                        that.endPulldownToRefresh();
                        that.refresh(true);
                    });
                }
            },
            up: {
                auto: false, //可选,默认false.自动上拉加载一次
                contentrefresh: '正在加载...',
                contentnomore: '没有更多数据了',
                callback: function() {
                    var that = this;
                    //上拉刷新，页数增加，数据量大小，当前排序类型（价格还是销量），排序方式..这些都要明确
                    //上面那些业务就不做了，没意思。。。
                    queryProduct({ proName: getParams.key, page: 1, pageSize: 4 }, function(data) {
                        $(".ct_product").html(template("list", data));
                        //停止上拉刷新，并告诉mui没有更多数据
                        that.endPullupToRefresh(true);
                    });
                }
            }
        }
    });
    //6.上拉的时候加载下一页数据，如果没有数据了要提示用户
});