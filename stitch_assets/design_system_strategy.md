# Clinical Sanctuary: Design System Strategy

## 1. Overview & Creative North Star
This design system balances professional authority with an atmosphere of calm, high-end hospitality. Layered depth and intentional white space guide the patient's eye.

## 2. Colors & Surface Architecture
- **Primary**: #005692 (Brand Authority)
- **Primary Container**: #1a6fb5 (Soft Interactions)
- **Tertiary**: #006049 (Precision/Teal)
- **Surface**: #f7f9fc (Canvas)
- **On Surface**: #191c1e (Text Dark)

### Architectural Rules
- **No-Line Rule**: Borders are prohibited for sectioning. Use background contrast (e.g., pure white card on #f7f9fc background).
- **Glassmorphism**: Nav bars use semi-transparent surface colors with `backdrop-blur: 12px`.

## 3. Typography: Editorial Authority
- **Font**: Inter
- **Display LG**: 48px, 700 weight (Hero value props)
- **Headline MD**: 32px, 600 weight (Section headers)
- **Body LG**: 16px, 400 weight (1.6 line height for legibility)

## 4. Elevation & Depth
- **Tonal Layering**: Depth is achieved by stacking surface scales.
- **Ambient Shadows**: Blue-tinted shadows (e.g., `rgba(13, 79, 138, 0.06)`) maintain the "sanctuary" feel.

## 5. Components
- **Public Navbar**: Centered links, glassmorphism.
- **Admin Sidebar**: 240px width, vertical pill indicator.
- **Buttons**: 8px radius, primary gradient.
- **Pills**: 99px radius for statuses.
