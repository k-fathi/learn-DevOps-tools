# Nginx Logging 

## Introduction
Nginx is a powerful web server that provides robust logging capabilities. Logging is essential for monitoring and troubleshooting web applications. Nginx supports various types of logs, including access logs and error logs. In this guide, we will explore how to configure and manage Nginx logging effectively.

```nginx

access_log /var/log/nginx/access.log main;
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/html;
        index index.html;
    }

    error_log /var/log/nginx/error.log warn;
}
```


1. access_log directive: The access_log directive is used to specify the location and format of the access log.
In the example above, the access log is stored in `/var/log/nginx/access.log`, and the log format is set to main.
You can customize the log format by defining a log_format block.

2. error_log directive: The error_log directive is used to specify the location and level of the error log.
In the example above, the error log is stored in `/var/log/nginx/error.log`, and the log level is set to warn. You can set different log levels such as debug, info, notice, warn, error, crit, alert, and emerg based on your requirements.


**why acccess log is out side and error log is inside the server block?**

- The placement of the `access_log` and `error_log` directives in Nginx configuration can vary based on the desired scope of logging.
- Access_log usually placed outside the server block to apply to all server blocks and store all access logs of Nginx.
- While `error_log` is often placed inside the server block to allow for more granular control over error logging for specific virtual hosts.
-  This allows you to have a global access log for all requests while having separate error logs for each server block, making it easier to troubleshoot issues specific to a particular domain or application.


Types of Logs categories in Nginx:
| Log Level | Severity | Description |
|-----------|----------|-------------|
| emerg | Critical | Emergency conditions, system is unusable |
| alert | Critical | Alert conditions, immediate action required |
| crit | High | Critical conditions, serious errors |
| error | High | Error conditions, operation failed |
| warn | Medium | Warning conditions, potential issues |
| notice | Medium | Normal but significant conditions |
| info | Low | Informational messages, general events |
| debug | Low | Debug messages, detailed troubleshooting information |


These log levels allow you to control the verbosity of the logs and filter them based on the severity of the events. By configuring the appropriate log levels, you can ensure that you capture relevant information for monitoring and troubleshooting your Nginx server.


The logs format can be:
| Log Format | Description |
|------------|-------------|
| main | Default log format, includes client IP, request method, URL, response status, and more |
| combined | Extended log format, includes additional information such as referrer and user agent |
| custom | Custom log format defined by the user, allowing for specific fields and formatting |
| json | JSON log format, useful for structured logging and integration with log management systems |

```
error_log /var/log/nginx/error.log <log_level> <log_format>;
```