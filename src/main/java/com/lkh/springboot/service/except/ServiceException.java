package com.lkh.springboot.service.except;

import com.lkh.springboot.service.except.ErrorType;

public abstract class ServiceException extends RuntimeException{

    private final ErrorType errorType;

    protected ServiceException(ErrorType errorType,Throwable e){
        super(errorType.getMessage(),e);
        this.errorType = errorType;
    }
    public ErrorType getErrorType(){
        return errorType;
    }
}
