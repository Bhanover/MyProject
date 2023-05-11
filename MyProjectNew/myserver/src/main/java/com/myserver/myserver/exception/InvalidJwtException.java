package com.myserver.myserver.exception;

public class InvalidJwtException extends Exception {

    public InvalidJwtException(String message) {
        super(message);
    }
}
