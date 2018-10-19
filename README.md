### 使用命令
```
npm install  	安装依赖
npm run serve	运行测试
npm run build	构建生产
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
    #缓存文件
    location ~* \.(css|js)$ {
        gzip_static on;
    }
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
    #支持gzip包加载
    location ~* ^.+\.(eot|ttf|otf|woff|svg)$ {
        access_log   off;
        expires      max;
    }
}
```
