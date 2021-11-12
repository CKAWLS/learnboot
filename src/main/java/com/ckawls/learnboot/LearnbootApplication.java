package com.ckawls.learnboot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ckawls.learnboot.mapper")
public class LearnbootApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnbootApplication.class, args);
	}

}
