package com.lkh.springboot.service.except;

import com.google.common.base.MoreObjects;

public interface ErrorType {
    int getCorrespondCode();
    String getMessage();
    default String toStringHelper(){
        return MoreObjects.toStringHelper(this)
                .add("correspondCode",getCorrespondCode())
                .add("message",getMessage())
                .toString();
    }
}
