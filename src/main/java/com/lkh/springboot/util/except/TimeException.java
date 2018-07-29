package com.lkh.springboot.util.except;

import com.lkh.springboot.service.except.ServiceException;

public class TimeException extends ServiceException {

    public TimeException(ErrorType errorType, Throwable e) {
        super(errorType, e);
    }
    public enum ErrorType implements com.lkh.springboot.service.except.ErrorType{
        TIME_ERROR(4001,"时间格式错误");

        private final int correspondCode;
        private final String message;

        ErrorType(int correspondCode,String message){
            this.correspondCode = correspondCode;
            this.message = message;
        }

        @Override
        public int getCorrespondCode() {
            return 0;
        }

        @Override
        public String getMessage() {
            return null;
        }
    }
}
