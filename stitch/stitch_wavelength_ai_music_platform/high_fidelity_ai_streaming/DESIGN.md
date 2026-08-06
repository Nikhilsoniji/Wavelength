---
name: High-Fidelity AI Streaming
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c9c4d8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#938ea1'
  outline-variant: '#484555'
  surface-tint: '#cabeff'
  primary: '#cabeff'
  on-primary: '#30009a'
  primary-container: '#937dff'
  on-primary-container: '#2a0088'
  inverse-primary: '#603ce3'
  secondary: '#a2e7ff'
  on-secondary: '#003642'
  secondary-container: '#00d2fd'
  on-secondary-container: '#005669'
  tertiary: '#cdbdff'
  on-tertiary: '#360096'
  tertiary-container: '#997bfe'
  on-tertiary-container: '#2f0084'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#4716cb'
  secondary-fixed: '#b4ebff'
  secondary-fixed-dim: '#3cd7ff'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#cdbdff'
  on-tertiary-fixed: '#1f005f'
  on-tertiary-fixed-variant: '#4d29ae'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is a premium, dark-first interface optimized for high-fidelity audio and AI-driven discovery. The brand personality is futuristic, sophisticated, and immersive, blending the mechanical precision of Nothing OS with the editorial richness of luxury streaming platforms.

The visual style utilizes **Modern Minimalist Glassmorphism**. Layouts are structured on a rigid grid but softened by organic, translucent layers and vibrant backdrops. Depth is achieved through light refraction and "optical glow" rather than traditional shadows, creating a UI that feels like it’s floating over a rhythmic, ever-changing soundscape.

## Colors
The palette is centered on a "Deep Space" foundation using `#09090B`. Primary accents are a spectrum of "Electric Purples" and "Cyan Glows" to signify AI activity and high-energy interactions.

- **Primary Neutrals**: Use `#09090B` for the main canvas to ensure maximum OLED black efficiency. Surfaces use `#141417` and `#1B1B20` with varying levels of opacity (60-80%) to facilitate background blur effects.
- **AI Accents**: The gradient of `#7B5CFF` to `#00D4FF` is reserved specifically for AI-generated playlists, smart suggestions, and active playback states.
- **Functional Colors**: Success and error states use high-vibrancy tones to remain legible against the dark background.

## Typography
The system uses **Inter** exclusively to maintain a clean, systematic appearance that doesn't distract from album artwork. 

- **Weight Strategy**: Use `ExtraBold` (800) for artist names and page headers to create a strong visual anchor. 
- **Scale**: Display sizes are aggressive for desktop layouts, while mobile headers shift to a more compact scale to allow for more content density. 
- **Readability**: Secondary text should always be set at `#B0B0B5` with a minimum size of 14px for accessibility against dark surfaces.

## Layout & Spacing
This design system operates on a **strict 8pt grid**. All padding, margins, and component heights must be multiples of 8 to ensure visual rhythm.

- **Desktop**: Employs a fixed-width sidebar (280px) and a fluid content area. Content is grouped in horizontal scrolling sections (Swimlanes) with 24px spacing between cards.
- **Mobile**: Uses a 16px safe margin on the horizontal axis. Navigation is handled via a persistent blurred bottom bar.
- **AI Contexts**: AI-specific containers may break the grid slightly with wider "Hero" footprints to signify importance.

## Elevation & Depth
Elevation is not conveyed through black shadows, but through **Tonal Luminance** and **Backdrop Blurs**.

- **Level 1 (Base)**: `#09090B` flat background.
- **Level 2 (Cards/Surfaces)**: `#1B1B20` at 70% opacity with a `24px` backdrop-filter blur. Use a `1px` inner border (stroke) at 10% white to define edges.
- **Level 3 (Floating Elements)**: The Bottom Player and Popovers use the same glass effect but include a subtle `0.5px` white border and a "glow" shadow (`spread: 0, blur: 40px, color: #000000`).
- **Active AI State**: Components gain a "breathing" outer glow using the primary accent color at 20% opacity.

## Shapes
The design system uses a heavily rounded aesthetic to feel approachable and high-end. 

- **Standard Cards**: 20px corner radius.
- **Outer Containers**: 24px corner radius.
- **Interactive Elements**: Buttons and input fields use 16px (Medium) or are fully pill-shaped (Maximum) depending on their hierarchy.
- **Album Art**: Always 12px radius to sit comfortably within the 20px card containers.

## Components

### Music Cards
Music cards feature a "Glass-Stack" look. The album art is the primary focus, while the text area below uses a semi-transparent background with a heavy blur. Hovering on a card triggers a subtle scale-up (1.02x) and increases the intensity of the inner border.

### Floating Player
The player is a persistent floating unit. It uses a maximum glassmorphism effect (40px blur). The progress bar is a custom "Neomorphic-Glass" hybrid: a recessed track with a glowing, high-contrast thumb.

### AI Elements
AI features (like "Smart Shuffle" or "Magic Playlists") are distinguished by a variable-width glowing border that cycles through the accent gradient. Use a "Sparkle" icon (24px) to denote AI-generated content.

### Inputs & Sliders
- **Sliders**: The track is semi-transparent white (10% opacity). The active fill is the `#7B5CFF` to `#00D4FF` gradient.
- **Buttons**: Primary buttons are solid gradient fills with white text. Secondary buttons are "Ghost" style with a glass background and white border.

### Sidebar/Navigation
The sidebar uses a minimal icon set (2px stroke) with labels in `Label-MD`. Active states are indicated by a vertical gradient pill on the left edge and a shift in icon color to Primary White.