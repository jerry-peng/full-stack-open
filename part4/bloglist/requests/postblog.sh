#!/usr/local/bin/zsh
curl -d '{"title": "Test", "author": "Author0", "url": "url.com", "likes": 0}' -H "Content-Type: application/json" -X POST localhost:3003/api/blogs
