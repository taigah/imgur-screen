# imgur-screen

Take a screenshot of your screen and upload it to imgur

# Dependencies

You need xfce4-screenshooter to use imgur-screen

# Installation

You just need to clone the repository and run index.js

```bash
npm i -g imgur-screen
imgur-screen [--album album_id] [--copy]
```

# Using credentials

Create a credentials.js file and fill it with your credentials

```javascript
// ~/.imgur-screen.json
{
  "username": "foo",
  "password": "bar"
}
```

# Uploading to album

You can upload your screenshot to a specific album using the --album flag

```bash
imgur-screen --album album_id
```
