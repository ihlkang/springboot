package com.lkh.springboot.controller;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.controller.response.type.UserResponseType;
import com.lkh.springboot.model.User;
import com.lkh.springboot.service.CaptchaService;
import com.lkh.springboot.service.UserService;
import com.lkh.springboot.util.CollectionUtil;
import com.lkh.springboot.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private static Logger log = LoggerFactory.getLogger(UserController.class);
    private final CaptchaService captchaService;
    private final UserService userService;
    @Autowired
    public UserController(CaptchaService captchaService,
                          UserService userService) {
        this.captchaService = captchaService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String,Object> loginByMobile(@RequestParam String mobile,
                                            @RequestParam String password,
                                            @RequestParam(required = false) String captchaToken) {
        log.info("mobile:"+mobile+",password:"+password+",captchaToken:"+captchaToken);
        //captchaService.requireCaptchaValidated(captchaToken);
        Pair<String,User> tokenAndUser = userService.loginUserByMobile(mobile,password);
        String token = tokenAndUser.getFirst();
        Map<String,Object> data = CollectionUtil.toMap(Pair.make("authenToken",token));
        return UserResponseType.SUCCESS.toResponseBody(data);
    }

    @PostMapping("/add")
    public Map<String,Object> addUser(@Valid @ModelAttribute UserRequest userRequest){
        userService.addUser(userRequest);
        return UserResponseType.SUCCESS.toResponseBody();
    }
}
