# Creme Cutz Barbershop — Website Rebuild

> **Instructions for Kiro:** Build a modern, fast, mobile-first website for **Creme Cutz Barbershop**, a student-run barbershop in Amherst, MA. It replaces the current Wix site at `https://cremecutz0805.wixsite.com/college-barbershop`. Read this whole file, generate a spec (requirements, design, tasks), then build it. All real business content is in Section 2 and is the source of truth. Do not invent anything not listed there.

---

## 1. Goals

| Goal | Success looks like |
|---|---|
| **Get bookings** | A visitor can reach the booking page in 1 tap from anywhere on the site |
| **Look premium** | Feels like a real, branded barbershop, not a default Wix template |
| **Fast on phones** | Most traffic comes from the Instagram bio link, so mobile (and the Instagram in-app browser) is priority #1 |
| **Easy to update** | Owners can change prices, photos, and links by editing one config file |
| **Be found locally** | Ranks for "barber Amherst MA", "UMass barber", "UMass Amherst haircut" |

**Audience:** UMass Amherst students (and nearby locals) who want a sharp, affordable, convenient cut from a fellow student.

---

## 2. Source Content (from the current site)

### Brand
- **Name:** Creme Cutz Barbershop
- **Hero headline (current):** "Elevate Your Look with Creme Cutz"
- **Hero subline (current):** "Welcome to Creme Cutz, where every haircut is a work of art."
- **Closing line (current):** "At Creme Cutz, we believe in the power of a great haircut to boost your confidence and style."

### Booking
- **Primary booking link (hero button "Book Here"):** `https://calendar.app.google/X7L3jdnQbqm5uuZb8`
- **Google Calendar appointment schedule (services section):** `https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1gtanjWwiLeCkearB_C78wJ8i48BQTVYIVC5FmQ8A0jmzLa82ZhMcX6muyR_LWnCxBNT4-PDLV`
  - Strip the `fbclid` tracking parameter.
  - Both links point to the same Google Calendar booking system, so **keep Google Calendar as the booking engine** (no data migration needed). Verify with the owner that they are the same schedule and use one canonical link.

### Services & Pricing
| Service | Price |
|---|---|
| Fade + Trim | $40 |
| Haircut (only) *or* Fade (only) | $35 |
| Line Up (only) *or* Facial Hair (only) | $20 |
| **Add-on:** Beard with any service | +$7 |

### About / Story
- **Section title:** "Our Barber Shop Story" / "Our Vision"
- **Vision copy:** Creme Cutz is a distinguished barbershop in Amherst, MA, dedicated to providing top-notch hair services for the community.
- **Meet the Team copy:** "At Creme Cutz, we believe in transforming haircuts into experiences. Our skilled barbers focus on precision and masterful techniques to craft hairstyles that reflect individual personalities."

### Team
| Name | Hometown | Background | Link |
|---|---|---|---|
| Aidan Sacco | Waltham, MA | Senior, Management major, UMass Amherst | `https://www.linkedin.com/in/aidansacco/` |
| Nikhil Pratapagiri | Boston, MA | Senior, CS major, UMass Amherst | `http://www.linkedin.com/in/nikhilpratapagiri` |

### Contact
- **Phone:** +1 (617) 650-9668
- **Email:** cremecutz0805@gmail.com
- **Address:** Patterson Hall, 204 Sunset Ave, Amherst, MA 01002
- **Legal pages that exist today:** Privacy Policy, Accessibility Statement (rebuild both as real pages)

### Gallery
- Currently shows "This channel is coming soon!" (empty). Build a real gallery with placeholders the owners can swap for their own cut photos.

---

## 3. Problems With the Current Site (Fix These)

1. **A Wix ad banner** ("This website was built on Wix") sits at the top. Remove it.
2. **Gallery is empty** and says "coming soon." This is the biggest missed opportunity, since barbershops sell on visuals.
3. **No visible hours or availability.** Add a section for this (see TODOs).
4. **Services link out to Google Calendar** with no context. Show prices on-page and make booking feel like part of the site.
5. **Footer copyright reads "© 2035."** Use a dynamically generated current year.
6. **Generic, vague copy.** Rewrite it to be specific, punchy, and student-focused.
7. **No social proof.** Add a reviews section (real reviews only).
8. **No Instagram link visible** despite Instagram being the main traffic source.
9. **No SEO basics** (local schema, meta tags, Open Graph).
10. **Tracking junk in URLs** (`fbclid`, `utm_*`). Strip from outbound links.

---

## 4. Brand & Visual Direction

**Vibe:** Clean, confident, modern. Premium but approachable, made for college students. "Creme" suggests warm, smooth, high-end.

| Role | Suggested color |
|---|---|
| Background | Warm cream `#F5EFE6` |
| Text / dark sections | Near-black `#111111` |
| Accent | Caramel/gold `#C8963E` |
| Secondary | Deep brown `#3B2A20` |

- **Fonts:** one bold display (Bebas Neue / Oswald / Playfair Display) + one clean body (Inter / DM Sans).
- **Imagery:** big, high-contrast photos of fades, lineups, and the chair setup. Use WebP/AVIF, `srcset`, lazy loading. Use clearly labeled royalty-free placeholders (Unsplash/Pexels) until real photos are supplied.
- **Motion:** subtle scroll reveals and hover states only; respect `prefers-reduced-motion`.
- **Logo:** none is supplied. Create a simple text wordmark ("CREME CUTZ") and flag it as replaceable.

---

## 5. Site Structure (single page, sticky header)

1. **Header:** wordmark, nav (Services, Gallery, About, Reviews, Contact), persistent **Book Now** button
2. **Hero:** headline, one-line tagline, CTAs: **Book Your Cut** (primary) and **See the Work** (secondary). Trust line: "Student-run • UMass Amherst"
3. **Services & Pricing:** cards for the four items in Section 2, with the beard add-on shown clearly and a Book button on each
4. **Gallery:** responsive grid with lightbox, plus a "Follow us on Instagram" button
5. **Our Story:** polished version of the vision copy
6. **Meet the Barbers:** cards for Aidan and Kashish (name, major, hometown, LinkedIn icon, photo placeholder)
7. **Reviews:** real testimonials only (placeholder block if none provided)
8. **How It Works:** 1) Pick a time, 2) Show up, 3) Walk out fresh
9. **Location & Contact:** address, map embed, click-to-call, click-to-text, email, hours (when supplied)
10. **FAQ:** payment methods, cancellations/late policy, how long a cut takes, what to bring (all answers marked TODO until confirmed)
11. **Footer:** contact info, Instagram, Privacy Policy, Accessibility Statement, dynamic © year

Also build `/privacy` and `/accessibility` pages.

---

## 6. Features

**Must have**
- Booking button in the header, hero, each service card, and a mobile sticky bottom bar
- Click-to-call (`tel:+16176509668`) and click-to-text (`sms:+16176509668`)
- Map embed and "Get Directions" button
- Fully responsive (test at 360, 390, 768, 1280px)
- All business info (services, prices, links, address, team) in one editable file: `content/site-config.json`
- Outbound booking link opens cleanly from the Instagram in-app browser

**Nice to have**
- Promo banner strip the owners can toggle (e.g. "Back to school special")
- Instagram feed embed (or a static grid that links out)
- Simple analytics (Plausible or GA4) with UTM tracking
- Printable QR code page linking to the site
- Dark mode

---

## 7. Technical Requirements

- **Stack (recommended):** Astro or Next.js (static export) + Tailwind CSS. Plain HTML/CSS/JS is fine if simpler. Document the choice.
- **Hosting:** Vercel, Netlify, or Cloudflare Pages (free tier)
- **No database.** Content is local JSON/Markdown.
- **Performance (mobile Lighthouse):** Performance, Accessibility, Best Practices, and SEO all ≥ 95. LCP < 2.0s. CLS < 0.05.
- **Accessibility:** semantic HTML, alt text on all images, WCAG AA contrast, visible focus states, keyboard-navigable menu and lightbox, 44px minimum tap targets.
- **SEO:**
  - Title: e.g. "Creme Cutz Barbershop | Student Barber in Amherst, MA"
  - Meta description and Open Graph / Twitter tags with a share image (links get shared from Instagram)
  - `HairSalon`/`BarberShop` JSON-LD schema with name, address, phone, price range, and `sameAs` social links
  - `sitemap.xml`, `robots.txt`, favicons
  - One `h1`, logical heading order
- **Testing:** Instagram in-app browser, iOS Safari, Chrome Android.

---

## 8. Suggested Folder Structure

```
creme-cutz/
├── README.md
├── TODO.md                  # open questions for the owners
├── content/
│   └── site-config.json     # services, prices, links, team, contact
├── public/
│   ├── images/
│   ├── favicon/
│   └── og-image.jpg
├── src/
│   ├── components/          # Header, Hero, Services, Gallery, Team, Reviews, Location, FAQ, Footer
│   ├── pages/               # index, privacy, accessibility
│   └── styles/
└── docs/
    └── HOW-TO-UPDATE.md     # plain-English guide for the owners
```

---

## 9. Copy Direction

Short, punchy, confident, and speaking directly to students. Starting points (refine freely):

- "Fresh Cuts. Student Prices. Right on Campus."
- "Look Sharp. Stay Sharp."
- "Run by UMass students, for UMass students."

Keep the owners' voice and facts. Don't claim anything about experience, awards, or years in business unless provided.

---

## 10. TODO.md: Open Questions to Flag for the Owners

Do **not** guess these. Add placeholders and list them in `TODO.md`:

- [ ] **Hours / availability** (not on current site)
- [ ] **Instagram handle** (needed for links and schema)
- [ ] **Real photos:** cuts, the setup, and each barber
- [ ] **Reviews/testimonials** (real ones only)
- [ ] **Payment methods** accepted (cash, Venmo, Zelle, card)
- [ ] **Cancellation / late policy**
- [ ] **Location privacy:** the address is a dorm (Patterson Hall). Confirm whether to show the full address publicly or only "UMass Amherst campus, appointment details sent after booking"
- [ ] **Logo** (if one exists)
- [ ] **Student discount, walk-ins, or promos?**
- [ ] **Confirm both Google Calendar links** are the same schedule
- [ ] **Who is the reply contact** for the contact form (if included)?

---

## 11. Deliverables

1. Working, deployable site in the structure above
2. `content/site-config.json` with all editable business info
3. `docs/HOW-TO-UPDATE.md` for non-technical owners (change prices, swap photos, update links)
4. `TODO.md` from Section 10
5. A short **"What I improved vs. the old site"** summary

## 12. Definition of Done

- [ ] All Section 2 content used accurately (spot-check phone, email, prices, links)
- [ ] All 10 problems in Section 3 resolved
- [ ] Booking reachable in 1 tap on mobile; both Google Calendar links work
- [ ] No Wix branding; dynamic copyright year
- [ ] Privacy and Accessibility pages built
- [ ] Lighthouse targets met on mobile
- [ ] SEO tags and local business schema in place
- [ ] Tested in the Instagram in-app browser
- [ ] Deployed to a free host with a preview URL

## 13. Guardrails

- Never fabricate reviews, hours, credentials, or prices
- Keep the business name and Google Calendar booking system unless told otherwise
- Use only licensed or royalty-free images, and label placeholders for replacement
- Prefer simple and maintainable over clever