package com.billy.spring.project.exeption;

public class InvalidJwtException extends Exception {

    public InvalidJwtException(String message) {
        super(message);
    }
}
