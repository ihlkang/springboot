package com.lkh.springboot.service.impl;

import com.lkh.springboot.service.CaptchaService;
import org.springframework.stereotype.Service;

@Service("CaptchaService")
public class CaptchaServiceImpl implements CaptchaService {

    @Override
    public void requireCaptchaValidated(String token) {

    }
}
