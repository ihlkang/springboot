package com.lkh.springboot.repo;

import com.lkh.springboot.model.User;

public interface UserRepository {
    User findByMobile(String mobile);
    
    User findByMobileAndPassword(String mobile,String password);
    
    void createUser(int id,String mobile);
}
