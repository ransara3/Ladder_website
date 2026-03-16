# Ladder Resort Website

A modern, responsive website for Ladder Resort located in Anuradhapura, Sri Lanka. Designed to attract foreign visitors and families, highlighting comfort, relaxation, and the rich cultural heritage of the area.

## Pages

- **Homepage** (`index.html`) — Welcoming banner, resort overview, room preview, amenities, and local attractions highlights
- **Rooms** (`rooms.html`) — Deluxe AC room showcase with photo gallery, room features, and amenities
- **Attractions** (`attractions.html`) — Local tourist attractions in Anuradhapura with visitor tips
- **Contact & Booking** (`contact.html`) — Booking form and contact information

## Features

- Responsive, mobile-friendly design with tropical/relaxing visual theme
- Interactive photo gallery with touch/swipe support
- Booking form with client-side validation
- Smooth scroll animations
- Sticky header with mobile navigation
- Easy to update — just replace image files and edit HTML text

## Tech Stack

- HTML5, CSS3, JavaScript (vanilla)
- Google Fonts (Playfair Display, Inter)
- No build tools or dependencies required

## How to Update

### Photos
Place room photos in the `images/` directory and update the `<img>` tags in `rooms.html`:
```html
<img src="images/room-1.jpg" alt="Room description" class="active">
<img src="images/room-2.jpg" alt="Room description">
```

### Text Content
Edit the HTML files directly. All text is in plain HTML — no templates or build process needed.

## Getting Started

Simply open `index.html` in a web browser, or serve the files with any static web server.
