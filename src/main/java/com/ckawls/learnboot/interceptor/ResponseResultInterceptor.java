package com.ckawls.learnboot.interceptor;

import java.lang.reflect.Method;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.ckawls.learnboot.annotation.ResponseResult;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class ResponseResultInterceptor implements HandlerInterceptor{
    //标记名称
    public static final String RESPONSE_RESULT_ANN= "RESPONSE_RESULT_ANN";

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler)
            throws Exception {
        System.out.println("preHandle开始");
        if(handler instanceof HandlerMethod){
            final HandlerMethod handlerMethod = (HandlerMethod) handler;
            final Class<?> clazz = handlerMethod.getBeanType();
            final Method method = handlerMethod.getMethod();

            //类上是否添加了注解
            if(clazz.isAnnotationPresent(ResponseResult.class)){
                //设置此请求返回体，需要包装，往下传递，在ResponseAdvice接口中进行判断
                req.setAttribute(RESPONSE_RESULT_ANN, clazz.getAnnotation(ResponseResult.class));
            }else if(method.isAnnotationPresent(ResponseResult.class)) {//方法体上是否有注解
                req.setAttribute(RESPONSE_RESULT_ANN, method.getAnnotation(ResponseResult.class));
            }
        }
        return true;
    }
}