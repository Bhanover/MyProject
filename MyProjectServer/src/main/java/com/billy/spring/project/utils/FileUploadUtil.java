package com.billy.spring.project.utils;

import java.io.File;

public class FileUploadUtil {

    public static void createDirIfNotExists(String dirName) throws SecurityException {
        File directory = new File(dirName);
        if (!directory.exists()) {
            directory.mkdir();
        }
    }
}
