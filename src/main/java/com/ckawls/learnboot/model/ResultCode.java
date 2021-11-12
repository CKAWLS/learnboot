package com.ckawls.learnboot.model;

public enum ResultCode {
    SUCCESS(1, "成功"),
    PARAM_IS_INVALID(1001, "参数无效"),
    PARAM_IS_BLANK(10002, "参数为空"),
    USER_NOT_EXIST(20001,"用户不存在");

    private final Integer code;
    private final String msg;

    ResultCode(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Integer code() {
        return this.code;
    }

    public String msg() {
        return this.msg;
    }
}