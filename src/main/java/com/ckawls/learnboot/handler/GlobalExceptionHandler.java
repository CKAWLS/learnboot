package com.ckawls.learnboot.handler;

import com.ckawls.learnboot.model.BaseResponse;
import com.ckawls.learnboot.model.ResultCode;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器类
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    public BaseResponse<Object> exceptionHandle(){
        return BaseResponse.failure(ResultCode.PARAM_IS_INVALID);
    }
}
