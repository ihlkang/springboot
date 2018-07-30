package com.lkh.springboot.service.except;

public class UserException extends ServiceException {

    public UserException(ErrorType errorType){
        super(errorType);
    }
    public UserException(ErrorType errorType, Throwable e) {
        super(errorType, e);
    }

    public enum ErrorType implements com.lkh.springboot.service.except.ErrorType{
        PASSWORD_MISMATCH(4001, "密码不匹配"),
        PASSWORD_REPEAT(4011,"密码重复"),
        NONEXISTENT_MOBILE(4002, "对应手机号的用户不存在"),
        UNMODIFIABLE_SESSION(5001, "无法设置 Session"),;

        private int correspondCode;
        private String message;
        ErrorType(int correspondCode,String message){
            this.correspondCode = correspondCode;
            this.message = message;
        }
        public int getCorrespondCode(){
            return correspondCode;
        }
        public String getMessage(){
            return message;
        }
        public String toString(){
            return toStringHelper();
        }
    }
}
