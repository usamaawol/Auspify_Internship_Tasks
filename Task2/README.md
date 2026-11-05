# Usama Awol — Frontend Developer Portfolio

**Internship Task 2** is a responsive, single-page portfolio introducing Usama Awol, describing his learning interests, presenting selected project concepts, and providing contact links.

## Project overview

The page is a personal profile and portfolio for a computer-science student developing frontend skills. Its purpose is to make the profile, skills, sample work, and ways to get in touch available in one navigable page. The intended audience includes internship supervisors, collaborators, and people reviewing the portfolio.

This is a static portfolio, not a content-management system. Its descriptions and project cards are written directly in the HTML, and the displayed technologies are profile content rather than evidence of integrated services.

## Objectives

- Present personal introduction, skills, projects, and contact information in a coherent order.
- Build anchor-based section navigation and an accessible mobile navigation toggle.
- Practice responsive CSS Grid and CSS media queries.
- Use a small amount of vanilla JavaScript for menu state and a dynamic footer year.

## Features and functionality

- **Responsive navigation:** Links jump to Home, About, Skills, Projects, and Contact. On narrow screens, a menu button toggles the navigation list.
- **Hero section:** Introduces the portfolio owner, describes their goals, and links to Projects and Contact.
- **About section:** Gives a short profile and education context.
- **Skills section:** Lists HTML, CSS, JavaScript, React, Firebase, and Git/GitHub with short learning-focused descriptions. These are portfolio statements, not application integrations.
- **Projects section:** Shows RedFox Tech Landing Page, TechMates, and AI Compass cards with status labels, summaries, and tags. TechMates and AI Compass are marked as in progress in the page content.
- **Contact section:** Includes an email link and GitHub/LinkedIn links that open in a new tab.
- **Dynamic copyright year:** JavaScript updates the footer's `#current-year` element at runtime.

## Technologies

| Technology | Use |
|---|---|
| HTML5 | Portfolio content and section structure |
| CSS3 | Visual design, responsive layout, and mobile menu visibility |
| Vanilla JavaScript | Mobile menu interactions and current-year text |

There is no framework, package manager configuration, API, database, or build pipeline.

## Architecture and data flow

The page is a small static frontend organized into three files:

1. `index.html` contains the page and references the stylesheet and deferred script.
2. `style.css` defines the desktop-first presentation and responsive rules.
3. `script.js` finds the menu and footer elements, toggles the menu's `.open` class and ARIA state, and writes the current year.

Portfolio and project content is hard-coded in markup. There is no client-side data store, form handling, or route system; navigation is through section anchors.

```text
Task2/
├── index.html
├── script.js
├── style.css
└── README.md
```

## Detailed implementation

### Mobile menu

The button with `id="menu-toggle"` controls the list with `id="nav-links"`. On click, `script.js` toggles the list's `open` class and synchronizes `aria-expanded`, `aria-label`, and the button glyph (`☰` / `✕`). Selecting a link closes the menu and restores its closed-state attributes.

The HTML supplies `aria-controls` to associate the button and list. In CSS, the menu button is hidden at larger widths and shown below 600px; `.nav-links.open` makes the list visible at that breakpoint.

### Footer year

At startup, the script updates `#current-year` with `new Date().getFullYear()`, avoiding a stale year in the footer.

### Content and links

Project cards are informational; their labels do not imply that the portfolio launches those projects. The email address and social profile URLs are written in `index.html` and should be checked before publishing. External profile links include `rel="noopener noreferrer"` with `target="_blank"`.

## UI and responsive design

The design uses a charcoal base, white surfaces, and a coral-orange accent. A two-column hero introduces the profile beside a compact profile card. About content uses a split layout; skills and projects use grid cards; the Contact section is centered and visually separated from the footer.

At 850px, hero/About layouts stack and the card grids reduce to two columns. At 600px, the navigation changes to a collapsible menu, and skills/projects become single-column lists. The CSS also includes a reduced-motion preference for scroll and transitions.

## How to see/open the project
The page can be opened directly as `index.html`; use the server when testing the site at a consistent browser origin.

## How to use

1. Use the header to move between the profile sections.
2. On a narrow viewport, activate the menu button to open navigation; selecting a link closes it.
3. Read the skills and project summaries to understand the portfolio content and displayed status.
4. Use **Contact Me** or the Contact section's email/social links to reach the configured destinations.
5. Resize the viewport to check the responsive card grids and mobile menu.

## Testing and verification

No automated test or lint commands are configured. Manually verify:

- The Home, About, Skills, Projects, and Contact links target the correct sections.
- At mobile width, the menu button opens and closes the links and updates `aria-expanded`.
- Clicking a mobile navigation item closes the menu.
- The displayed footer year matches the current year.
- Email and external profile links point to the intended accounts.
- Layout remains readable at desktop, tablet, and phone widths.

## Challenges and implementation decisions

- **Navigation on small screens:** CSS visibility alone would not provide an interactive menu, so a small vanilla-JavaScript toggle manages visibility and accessible state together.
- **Single-page structure:** Anchor links keep navigation straightforward and avoid adding routing dependencies for a small portfolio.
- **Portfolio content is static:** Project status and descriptions are embedded in HTML; changing them requires editing the page.

## Learning outcomes

The project demonstrates semantic document organization, accessible button state, DOM event listeners, CSS Grid, responsive breakpoints, and the difference between displaying a technology in portfolio content and integrating it into an application.

## Future improvements

- Verify the profile text, email, and external profile links before sharing publicly.
- Add real links to completed project repositories or live demos where available.
- Introduce a content source or template only if the number of projects makes hand-edited markup cumbersome.
- Add browser-based checks for mobile navigation and section links if a test setup is introduced.

## Conclusion

The portfolio combines personal profile content with responsive section navigation and a small mobile interaction. It is a self-contained HTML/CSS/JavaScript project that demonstrates core frontend presentation and DOM skills without relying on a framework.
