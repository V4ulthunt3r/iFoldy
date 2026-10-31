# iFoldy — landing page

Static landing page for **iFoldy**, the iOS app that turns iPhone Duo into a stitched
wallet: unfold the phone and the wallet opens with it — card pockets, a folded note, a
paper map and a pocket calendar. Regular iPhones are covered in their own section.

English is the default; German lives alongside it.

| Page | English | German |
| --- | --- | --- |
| Landing | `index.html` | `index-de.html` |
| Support | `support.html` | `support-de.html` |
| Privacy policy | `privacy.html` | `privacy-de.html` |
| Legal notice | `impressum.html` | `impressum-de.html` |

## Structure

```
assets/landing.css   all styles, light (paper) + dark (leather), tokens on :root / .dark
assets/site.js       theme toggle, nav scroll edge, scroll reveal, hero cover drag
assets/icons.svg     shared icon sprite, referenced as assets/icons.svg#i-…
assets/frame-duo-*.svg  iPhone Duo frames (ShotForge), inner landscape + outer portrait
assets/icon-*.png    generated from the app icon in the Xcode project
assets/img/          simulator screenshots and recordings from the app's artifacts/
```

Hand-written static HTML — no build step, no dependencies, no cookies, no tracking.
`.nojekyll` keeps GitHub Pages from processing the files.

The hero shows the open Duo (card demo recording) with the folded Duo in front.
Screens sit under the frame SVG's opening; the percentages in `.duo` / `.duo-outer`
come from the opening rects in those SVGs.

The iPhone section stacks a closed cover over the open interior. Tap or drag the cover
up to open it; release speed decides, like in the app. The swatches swap the cover
material.

## Before launch

- Replace the “Coming soon to the App Store” badges (`.store-badge`, two per landing
  page) with the real App Store link once the app is live.
- The site is served at <https://ifoldy.app/> (`CNAME` file, GitHub Pages custom domain).
  The canonical URLs in each `<head>`, `robots.txt` and `sitemap.xml` use that domain.

## Local preview

```bash
python3 -m http.server 4174
```
