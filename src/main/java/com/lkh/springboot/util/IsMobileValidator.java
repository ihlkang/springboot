package com.lkh.springboot.util;

import com.lkh.springboot.annotation.IsMobile;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IsMobileValidator implements ConstraintValidator<IsMobile,String> {

    private boolean required = false;
    @Override
    public void initialize(IsMobile isMobile) {
        required = isMobile.required();
    }

    @Override
    public boolean isValid(String mobile, ConstraintValidatorContext constraintValidatorContext) {
        if(required){
            return DataFormatCheckUtil.checkMobile(mobile);
        }else{
            if(StringUtils.isEmpty(mobile)){
                return true;
            }else{
                return DataFormatCheckUtil.checkMobile(mobile);
            }
        }
    }
}
