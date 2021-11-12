package com.ckawls.learnboot.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class BaseResponse<T> implements Serializable {
    private Integer code;
    private String msg;
    private T data;
    private Long timestamp;


    public Integer getCode() {
        return this.code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Long getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }


    public BaseResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> BaseResponse<T> success(){
        BaseResponse<T> resp  = new BaseResponse<T>();
        resp.setCode(ResultCode.SUCCESS.code());
        resp.setMsg(ResultCode.SUCCESS.msg());
        return resp;
    }

    public static <T> BaseResponse<T> success(T data){
        BaseResponse<T> resp  = new BaseResponse<T>();
        resp.setCode(ResultCode.SUCCESS.code());
        resp.setMsg(ResultCode.SUCCESS.msg());
        resp.setData(data);
        return resp;
    }

    public static <T> BaseResponse<T> failure(ResultCode resCode){
        BaseResponse<T> resp  = new BaseResponse<T>();
        resp.setCode(resCode.code());
        resp.setMsg(resCode.msg());
        return resp;
    }

    public static <T> BaseResponse<T> failure(ResultCode resCode, T data){
        BaseResponse<T> resp  = new BaseResponse<T>();
        resp.setCode(resCode.code());
        resp.setMsg(resCode.msg());
        resp.setData(data);
        return resp;
    }

}