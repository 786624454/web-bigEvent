$(function(){
  let root_path='http://www.liulongbin.top:3007'
    // 点击“去注册账号”的链接
  $('#link_reg').on('click', function() {
    // 隐藏元素不占页面位置
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })

 //获取表单form对象
 let form =layui.form
 let layer = layui.layer
  form.verify({
    username: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
    }
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    ,pass: [
      //  [\S]非空格
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] 
    ,repwd:function(value){
      //value,通过形参拿到用户  再次输入密码框的值
      //要拿到用户输入密码框的值
      let pwd=$('.reg-box [name=password]').val()
      if(pwd!==value) {
        return '两次密码输入不一致'
      }
    }
  })     
  
  
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
      // 1. 阻止默认的提交行为
      e.preventDefault()

      // 2. 发起Ajax的POST请求
      let data = {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      }
      $.post('/api/reguser', data, function(res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
        // 模拟人的点击行为
        $('#link_login').click()
      })
    })

  // 监听登录表单的提交事件
  $('#form_login').submit(function(e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),  //username=tuotuo&password=1234567
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        //跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})