# How to Update the Site

Almost everything lives in one file: `content/site-config.json`. After editing it, the site rebuilds on deploy (Netlify/Vercel/Cloudflare run `npm run build`, publish folder `dist`).

Keep the quotes, commas and brackets exactly as they are. Only change the text between quotes.

## Change a price
Find `"services"`, then the item. Change the number after `"price":`. Example: `"price": 40`. The beard add-on price is under `"addon"`.

## Swap a photo
1. Put the new image in `public/images/` (JPG or WebP, around 1200px wide).
2. In the config, change the matching `"src"` to `/images/your-file.jpg`.
3. Update `"alt"` to describe the photo and set `"placeholder": false`.
Barber photos: change `"photo"` under `team.members`.

## Update links
- Booking: `booking.url`
- Instagram: `social.instagram` (full URL, e.g. https://instagram.com/yourhandle). Leaving it empty hides Instagram buttons.
- LinkedIn: `team.members[].linkedin`

## Add hours
Under `contact.hours`, add lines like:
`{ "day": "Mon - Fri", "time": "4pm - 9pm" }`

## Add a review (real ones only)
Under `reviews.items`: `{ "text": "Best fade on campus.", "author": "Name" }`

## Answer an FAQ
Fill in the `"a"` text for that question.

## Promo banner
Set `promo.enabled` to `true` and edit `promo.text`.

## Hide the dorm address
Set `contact.address.show` to `false`.

## Preview on your computer
`npm start`, then open http://localhost:4173
