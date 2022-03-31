package com.ckawls.learnboot.configure;

import java.util.List;
import com.ckawls.learnboot.interceptor.ResponseResultInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 在版本控制配置类中添加拦截器
 * 
 * WebMvcConfigurer,WebMvcConfigurationSupport
 * 只有当WebMvcConfigurationSupport类不存在的时候才会生效WebMvc自动化配置，
 * WebMvc自动配置类中不仅定义了classpath:/META-INF/resources/，classpath:/resources/，classpath:/static/，classpath:/public/等路径的映射，
 * 还定义了配置文件spring.mvc开头的配置信息等。
 */
@Configuration
@ComponentScan(basePackages="com.ckawls.learnboot")
public class WebConfiguration implements WebMvcConfigurer{
    @Autowired
    private ResponseResultInterceptor responseResultInterceptor;

    // @Autowired
    // private StringHttpMessageConverter stringHttpMessageConverter;
    
    // @Autowired
    // private MappingJackson2HttpMessageConverter httpMessageConverter;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(responseResultInterceptor);
    }

    // @Override   
    // protected void addInterceptors(InterceptorRegistry registry) {
    //     registry.addInterceptor(responseResultInterceptor).excludePathPatterns("/login.html","/dologin");
    //     super.addInterceptors(registry);
    // }

    // @Override
    // protected void addResourceHandlers(ResourceHandlerRegistry registry) {
    //     registry.addResourceHandler("/**").addResourceLocations("/calsspath:/static/","classpath:/templates/","classpath:/resources/");
    //     super.addResourceHandlers(registry);
    // }

    // @Override
    // protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    //     for (int i = 0; i < converters.size(); i++) {
    //         if (converters.get(i) instanceof StringHttpMessageConverter){
    //             converters.set(i, stringHttpMessageConverter);
    //         }
    //         if (converters.get(i) instanceof MappingJackson2HttpMessageConverter) {
    //             converters.set(i, httpMessageConverter);
    //         }
    //     }
    // }
}