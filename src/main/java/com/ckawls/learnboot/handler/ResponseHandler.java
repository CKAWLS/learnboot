package com.ckawls.learnboot.handler;

import javax.servlet.http.HttpServletRequest;
import com.ckawls.learnboot.annotation.ResponseResult;
import com.ckawls.learnboot.model.BaseResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@Component
@ControllerAdvice(annotations = ResponseResult.class)
public class ResponseHandler implements ResponseBodyAdvice<Object>{
    //标记名称
    public static final String RESPONSE_RESULT_ANN= "RESPONSE_RESULT_ANN";

    //请求是否包含了包装注解标记： 没有直接返回，不重写返回体
    @Override
    public boolean supports(MethodParameter arg0, Class<? extends HttpMessageConverter<?>> aClass) {
        ServletRequestAttributes sra =  (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
        HttpServletRequest hsr = sra.getRequest();
        //判断请求中是否有包装标记
        ResponseResult rr = (ResponseResult)hsr.getAttribute(RESPONSE_RESULT_ANN);
        return rr == null ? false : true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> arg, ServerHttpRequest req,
            ServerHttpResponse resp) {
        if(body instanceof BaseResponse){
            return body;
        }
        return BaseResponse.success(body);
    }
    
    
}
