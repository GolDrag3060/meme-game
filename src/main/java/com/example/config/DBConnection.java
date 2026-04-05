package com.example.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/meme_game";
    private static final String USER = "root";
    private static final String PASSWORD = "admin";

    static {
        try {
            // This ensures the MySQL driver is loaded in older Tomcat versions
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        // Remove the try-catch here. Let the caller handle the error.
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}