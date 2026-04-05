package com.example.Models;

public class Meme {
    private int id;
    private String type;
    private String path;

    public Meme(int id, String title, String url) {
        this.id = id;
        this.type = title;
        this.path = url;
    }
}