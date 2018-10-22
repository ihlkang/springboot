package com.lkh.springboot.repo;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.model.BlackUser;
import com.lkh.springboot.model.User;

import java.util.List;

public interface UserRepository {
    User findByMobile(String mobile);
    
    User findByMobileAndPassword(String mobile,String password);
    
    void createUser(UserRequest userRequest);

    int importBlack(List<BlackUser> blackLists);

    List<BlackUser> queryBlack();
}
