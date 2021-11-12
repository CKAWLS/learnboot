package com.ckawls.learnboot;

import java.util.List;

import com.ckawls.learnboot.mapper.UserMapper;
import com.ckawls.learnboot.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LearnbootApplicationTests {

	@Autowired
	private UserMapper userMapper;


	@Test
	void contextLoads() {
		List<User> userList = userMapper.selectList(null);
        userList.forEach(System.out::println);
	}

}
