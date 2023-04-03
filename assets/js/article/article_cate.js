// let cate_list=require('../../../mock/cate_list.js')

$(function() {
  let layer = layui.layer
  let form =layui.form
  
  // let cate_list={
  //   "status": 0,
  //   "message": "获取文章分类列表成功！",
  //   "data": [
  //     {
  //       "Id": 1,
  //       "name": "最新",
  //       "alias": "ZuiXin",
  //       "is_delete": 0
  //     },
  //     {
  //       "Id": 2,
  //       "name": "科技",
  //       "alias": "KeJi",
  //       "is_delete": 0
  //     },
  //     {
  //       "Id": 3,
  //       "name": "股市",
  //       "alias": "GuShi",
  //       "is_delete": 0
  //     },
  //     {
  //       "Id": 4,
  //       "name": "历史",
  //       "alias": "LiShi",
  //       "is_delete": 0
  //     },
  //     {
  //       "Id": 5,
  //       "name": "情感",
  //       "alias": "QingGan",
  //       "is_delete": 0
  //     }
  //   ]
  // }
  
  getLocalStorage();
      //读取本地存储，有数据就读取，没有旧默认加入三条数据
    function getLocalStorage() {
        let data = localStorage.getItem("data");
        if (data) {
          return JSON.parse(data);
        } else {
    let arr = [
       {
      Id: 1,
      name: "最新",
      alias: "ZuiXin",
      is_delete: 0
    },
    {
      Id: 2,
      name: "科技",
      alias: "KeJi",
      is_delete: 0
    },
    {
      Id: 3,
      name: "股市",
      alias: "GuShi",
      is_delete: 0
    },
    {
      Id: 4,
      name: "历史",
      alias: "LiShi",
      is_delete: 0
    },
    {
      Id: 5,
      name: "情感",
      alias: "QingGan",
      is_delete: 0
    }
  ]
          //写入本地存储
       localStorage.setItem("data", JSON.stringify(arr));
        }
      }
  
	  
  initArtCateList()
  // 获取文章分类的列表
  function initArtCateList() {
    // $.ajax({
    //   method: 'GET',
    //   url: '/my/article/cates',
    //   success: function(res) {
    //     var htmlStr = template('tpl-table', res)
    //     $('tbody').html(htmlStr)
    //   }
    // })

    //先读取本地存储
    let data = getLocalStorage();
    // console.log(data)
    let htmlStr = template('tpl-table', data)
    $('tbody').html(htmlStr)
  }

  // 为添加类别按钮绑定点击事件
  let indexAdd = null
  $('#btnAddCate').on('click', function() {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form_add', function(e) {
    e.preventDefault()
     //先读取本地存储
     let arr = getLocalStorage();
    let params={
      name:$('#addAtr').val(),
      alias:$('#addAtr1').val()
    }
    // $.ajax({
    //   method: 'POST',
    //   url:'/my/article/addcates',
    //   // data: $(this).serialize(),
    //   data:params,
    //   success: function(res) {
    //     console.log(res)
    //     if (res.status !== 0) {
    //       return layer.msg('新增分类失败！')
    //     }
    //     initArtCateList()
    //     layer.msg('新增分类成功！')
    //     // 根据索引，关闭对应的弹出层
    //     layer.close(indexAdd)
    //   }
    // })
    let id=arr.length+1
    arr.push({
      "Id": id,
      "name": params.name,
      "alias": params.alias,
      "is_delete": 0
    })
       //读取完本地存储，往本地存储追加新的数据
       localStorage.setItem("data", JSON.stringify(arr));
      //  console.log(arr);
       initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)

  })
 
   //表单重置
  $('#btnReset').on('click',function(e){
      // 1. 阻止默认的提交行为
    e.preventDefault()
      $('.layui-input[name=name]').val('')
      $('.layui-input[name=alias]').val('')
       initArtCateList()
     })


     //点击编辑，弹出对话框,并回写数据
  $('tbody').on('click','.btn-edit',function(){
    let indexEdit = null
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '编辑文章分类',
      content: $('#dialog-edit').html()
      })
     
      //获取当前编辑的id
      let id=$(this).attr('data-id')
      console.log(id)
    // 发起请求获取对应分类的数据
    //  $.ajax({
    //     method: 'GET',
    //     url: '/my/article/cates/' + id,
    //     success: function(res) {
    //       // console.log(res)
    //     form.val('form-edit', res.data)
    //   }
    // })

     //先读取本地存储
     let arr = getLocalStorage();
     form.val('form-edit',arr[id-1] )
    //  $('.layui-input[name=name]').val(cate_list.data[id-1].name)
    //  $('.layui-input[name=alias]').val(cate_list.data[id-1].alias)
    
  })

// 通过代理的形式，为 form-edit 表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function(e) {
    e.preventDefault()
  //  let params=$(this).serialize()
  //  console.log(params)
  $.ajax({
        method: 'POST',
        url:'/my/article/updatecate',
        data: $(this).serialize(),
        success: function(res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg('更新分类数据失败！')
          }
          layer.msg('更新分类数据成功！')
          layer.close(indexEdit)
          initArtCateList()
        }
  })
  })
 
   //删除功能
   $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      // $.ajax({
      //   method: 'GET',
      //   url: '/my/article/deletecate/' + id,
      //   success: function(res) {
      //     if (res.status !== 0) {
      //       return layer.msg('删除分类失败！')
      //     }
      //     layer.msg('删除分类成功！')
      //     layer.close(index)
      //     initArtCateList()
      //   }
      // })
         //先读取本地存储
         let arr=getLocalStorage()
         arr.splice(id-1, 1);
          layer.msg('删除分类成功！')
          layer.close(index)
         localStorage.setItem("data", JSON.stringify(arr));
         initArtCateList()
    })
 })


})
