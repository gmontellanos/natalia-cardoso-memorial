# Natalia Cardoso Memorial Website

## Folder structure
```
index.html
css/style.css
js/main.js
images/         <- add all image/graphic assets here (not included in this delivery)
```

## Images to add to /images
- `greenstripebackground.svg` — striped accent background
- `nataliacardoso.svg` — main graphic used on the splash and hero
- `wreath.webp` — floral wreath (transparent)
- `flower.webp` — decorative flower / favicon source
- `gallery1.jpg` … `gallery52.jpg` — the 52 square gallery photos
  - If your files use a different extension (`.png`, `.webp`), change the
    single `GALLERY_EXT` value near the top of `js/main.js`.
- (optional, for the video) a poster still, e.g. `video-poster.jpg`

## Things left as placeholders — search the HTML for these comments
1. **Zoom** (`#memorial` section): update `href="#"` on `[data-zoom-link]`
   with the real Zoom URL, and replace the "Em breve / Próximamente" text
   next to Meeting ID and Password.
2. **Memorial song** (`#memorial` section): update `href="#"` on
   `[data-song-link]` with the jw.org song link, and replace the placeholder
   text with the real song name + number.
3. **Beliefs link** (`#memorial` section): update `href="#"` on
   `[data-beliefs-link]`.
4. **Video** (`#video` section): the placeholder `<div class="video-placeholder">`
   has a comment right above it showing the exact `<video>` markup to swap
   in once the file and poster image are ready.

## Notes
- Language choice is remembered for the current browser session
  (`sessionStorage`) — it resets when the tab/browser is closed, per the brief.
- All family-supplied copy (biography and thank-you message, PT and ES) is
  included exactly as given — nothing was reworded.
- The gallery, lightbox, and language switching all work without a build
  step — just open `index.html`, or serve the folder with any static file
  server.
