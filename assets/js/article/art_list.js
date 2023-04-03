$(function(){
    let form=layui.form
    let layer=layui.layer
    let laypage = layui.laypage
    // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

 // 定义渲染分页的方法
function renderPage(total) {
  // 调用 laypage.render() 方法来渲染分页的结构
  laypage.render({
    elem: 'pageBox', // 分页容器的 Id
    count: total, // 总数据条数
    limit: q.pagesize, // 每页显示几条数据
    curr: q.pagenum, // 设置默认被选中的分页
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
    jump: function(obj,first) {
        // console.log(obj.curr) 拿最新的页码值
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        // first 为undefined 就是第二种方式触发
        if(!first){
          initTable()
        }
      }
  })
}

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
  let q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

   // 获取文章列表数据的方法
   initTable()  
   function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        let htmlStr = template('tpl-table', res)
        // $('tbody').append(htmlStr)
        $('tbody').html(htmlStr)
          // 调用渲染分页的方法
          renderPage(res.total)
      }
    })
      
  }

  //发起请求获取并渲染文章分类的下拉选择框
  initCate()
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

   //筛选功能
    $('#form-search').on('submit', function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
      let cate_id = $('[name=cate_id]').val()
      let state = $('[name=state]').val()
      // 为查询参数对象 q 中对应的属性赋值
      q.cate_id = cate_id
      q.state = state
    // console.log(cate_id)
    // console.log(state)
    initTable()  
      
    })
 
  //点击编辑按钮展示修改文章分类的弹出层


    //删除文章列表功能
    $('tbody').on('click', '#btn-delete', function() {
      var id = $(this).attr('data-id')
      // 提示用户是否要删除
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
        $.ajax({
          method: 'GET',
          url: '/my/article/delete/' + id,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('删除分类失败！')
            }
            layer.msg('删除分类成功！')
            layer.close(index)
            initTable()  
          }
        })
      })
  })

})
