package com.lkh.springboot.controller.response.type;

public enum  UserResponseType implements ResponseType{
    SUCCESS(2000,"操作成功"),
    PASSWORD_WORNG(4001,"密码错误");

    private static final UserResponseType[] enums = UserResponseType.values();
    private final int code;
    private final String msg;

    UserResponseType(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public static UserResponseType fromCode(int code){
        return ResponseType.fromCode(enums,code);
    }
    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMsg() {
        return msg;
    }
}
