
#### 说明：整体框架采用express+node+ts。使用pm2去管理运行项目。

1、登录模块
================================

1） express + expressjwt + RS256（非对称加密）

* Mac 电脑 如何通过openssl 对nodejs生成公钥和私钥
  
  1、打开终端，输入以下命令来生成私钥：

  ```shell
  openssl genrsa -out private_key.pem 2048
  ```
  2、输入以下命令来生成公钥：

  ```shell
  openssl rsa -pubout -in private_key.pem -out public_key.pem
  ```
  在这个过程中，系统将提示您输入密码。如果您需要将密码保护私钥，请输入密码并妥善保管。


  
