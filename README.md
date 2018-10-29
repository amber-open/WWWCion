### 使用命令
```
npm或yarn install  	安装依赖
npm或yarn run serve	运行测试
npm或yarn run build	构建生产
```

### nginx配置
```
location / {
    root   test;
    index  index.html index.htm;
    #支持vue-router history模式
    if (!-e $request_filename) {
        rewrite ^/(.*) /index.html last;
        break;
    }
    #支持gzip包加载
    location ~* \.(css|js)$ {
        gzip_static on;
    }
    #缓存文件
    location ~* ^.+\.(html|htm)$ {
        expires      1h;
    }
    location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
        access_log   off;
        expires      24h;
    }
    location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ {
        access_log   off;
        expires      30d;
    }
    location ~* ^.+\.(eot|ttf|otf|woff|svg)$ {
        access_log   off;
        expires      max;
    }
}
```
