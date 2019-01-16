$(function() {
    // 1.请求导航栏数据
    getFirstCategoryData(function(data) {
        // console.log(data);
        //拿到模板需要渲染的区域,给html方法中传入一个模板对象
        $(".cate_left ul").html(template("firstTemplate", data));
        // 2.请求该导航项对应的商品数据
        var categoryId = $(".cate_left ul li.now a").attr("data-id");
        console.log(categoryId);
        getSecondCategoryData(categoryId, function(data) {
            console.log(data);
            //拿到模板需要渲染的区域,给html方法中传入一个模板对象
            $(".cate_right ul").html(template("secondTemplate", data));
        });


        var navs = $(".cate_left ul li");
        //导航栏注册点击事件
        navs.on("click", function(e) {
            //先把所有的导航项目设置为非选中状态
            for (let i = 0; i < navs.length; i++) {
                $(navs[i]).removeClass("now");
            }
            //把自身设置为选中状态
            $(this).addClass("now");
            //请求该导航项对应的商品数据
            var categoryId = $(".cate_left ul li.now a").attr("data-id");
            console.log(categoryId);
            getSecondCategoryData(categoryId, function(data) {
                console.log(data);
                //拿到模板需要渲染的区域,给html方法中传入一个模板对象
                $(".cate_right ul").html(template("secondTemplate", data));
            });
        });
    });

});

// 获取一级分类的数据
var getFirstCategoryData = function(callback) {
    $.ajax({
        url: "/category/queryTopCategory",
        type: "get",
        data: "",
        dataType: "json",
        success: function(data) {
            if (callback) {
                callback(data);
            }
        }
    });
}

// 获取二级分类的数据

var getSecondCategoryData = function(categoryId, callback) {
    $.ajax({
        url: "/category/querySecondCategory",
        type: "get",
        data: { id: categoryId },
        dataType: "json",
        success: function(data) {
            if (callback) {
                callback(data);
            }
        }
    });
}