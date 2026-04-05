package com.example.routes;

import com.example.Models.Meme;
import com.example.config.DBConnection;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/memes")
public class getRandomMeme extends HttpServlet {
    private final Gson gson = new Gson();
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        Statement stm = null;
        List<Meme> memes = new ArrayList<>();
        try  {
            stm = conn.createStatement();
            ResultSet rs = stm.executeQuery("SELECT * FROM memes ORDER BY RAND() LIMIT 1");
            while (rs.next()) {
                memes.add(new Meme(
                        rs.getInt("id"),
                        rs.getString("type"),
                        rs.getString("path")
                ));
            }
        } catch (SQLException e) {
            response.setStatus(500);
            response.getWriter().write("Database Error: " + e.getMessage());
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = this.gson.toJson(memes);
        response.getWriter().write(jsonResponse);
    }
}
