package com.lkh.springboot.service;

public interface CaptchaService {

    void requireCaptchaValidated(String token);

}
