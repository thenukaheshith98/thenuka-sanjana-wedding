# Online Wedding Invitation

A mobile-first digital invitation in the style of the [InviteMint TikTok example](https://vt.tiktok.com/ZSbkAEmvm/): wax-seal envelope, personalized guest name, countdown, events, gallery, map, music, and RSVP.

## Open it

Serve the folder (opening `index.html` as a file can block the map and fonts):

```bash
npx --yes serve .
```

Then visit `http://localhost:3000`.

Personalized guest links:

`http://localhost:3000/?to=Uncle%20Sunil`

## Customize

Edit `js/config.js`:

1. Couple names, parents, date, venues, events, story
2. Drop photographs into `assets/photos/` as `1.jpg` … `6.jpg`
3. Optional cover photo: set `coverPhoto`
4. Optional music you own: `assets/music/song.mp3`
5. Set `whatsapp` (international digits, no `+`) so RSVPs open a chat to you
6. Optional `rsvpWebhook` if you later add a Google Sheet endpoint

Do not commit secrets. Keep API keys out of this repo.

## Share on WhatsApp

Host the folder (Netlify, GitHub Pages, Cloudflare Pages), then send each guest:

`https://your-site.netlify.app/?to=Amma`
