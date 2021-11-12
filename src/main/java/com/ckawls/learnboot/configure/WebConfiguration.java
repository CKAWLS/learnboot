package com.ckawls.learnboot.configure;

import com.ckawls.learnboot.interceptor.ResponseResultInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

/**
 * 在版本控制配置类中添加拦截器
 */
@Configuration
public class WebConfiguration extends WebMvcConfigurationSupport{
    @Autowired
    private ResponseResultInterceptor responseResultInterceptor;

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(responseResultInterceptor);
        super.addInterceptors(registry);
    }
}