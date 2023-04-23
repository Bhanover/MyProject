package com.billy.spring.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SpringBootApplicationInicializer {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootApplicationInicializer.class, args);
	}

}
