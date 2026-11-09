# Open Questions for the Owners

Nothing below has been guessed. Placeholders are in `content/site-config.json`.

- [ ] **Hours / availability**: add to `contact.hours` (currently shows "set by appointment availability")
- [ ] **Instagram handle**: set `social.instagram`. The Instagram buttons, footer link and schema `sameAs` appear automatically once filled
- [ ] **Real photos**: cuts (`gallery.items`), the setup, and each barber (`team.members[].photo`)
- [ ] **Reviews**: add real ones only to `reviews.items`
- [ ] **Payment methods** (FAQ answer)
- [ ] **Cancellation / late policy** (FAQ answer)
- [ ] **Location privacy**: the address is a dorm (Patterson Hall). Set `contact.address.show` to `false` to show only the campus message and hide the map
- [ ] **Logo**: the "CREME CUTZ" text wordmark is a replaceable stand-in
- [ ] **Student discount, walk-ins, promos?** Toggle `promo.enabled` for the banner strip
- [ ] **Confirm both Google Calendar links** are the same schedule (`booking.url` is used everywhere; `booking.scheduleUrl` is the backup)
- [ ] **Reply contact for a contact form**: no form was built, so none is needed unless you want one
- [ ] **Live domain**: set `siteUrl` in the config (used for canonical, sitemap, social share image)
- [ ] **Review the Privacy Policy and Accessibility pages** (drafted from what the site does)
- [ ] **Share image** (`public/og-image.png`) is a simple text card; replace with a photo if desired
