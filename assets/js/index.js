$(function(){
    getUserInfo()
    //获取用户信息
   function getUserInfo(){
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        //   },
        success:function(res){
            console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
              }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    // 不论成功还是失败，最终都会调用 complete 回调函数
    //     complete: function(res) {
    //     // console.log('执行了 complete 回调：')
    //     // console.log(res)
    //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //       // 1. 强制清空 token
    //       localStorage.removeItem('token')
    //       // 2. 强制跳转到登录页面
    //       location.href = '/login.html'
    //     }
    //   } 


      })
   } 
   // 渲染用户的头像
  function renderAvatar(user) {
    //获取用户名称
    let name=user.nickname||user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    if(user.user_pic!==null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        //渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').show(first)
    }
   }

   //实现退出功能
   let layer = layui.layer
   $('#layout').on('click',function(){
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){ 
    //do something
      // 1. 清空本地存储中的 token
      localStorage.removeItem('token')
      // 2. 重新跳转到登录页面
      location.href = '/login.html'

      // 关闭 confirm 询问框
      layer.close(index)
   })
 })
})
