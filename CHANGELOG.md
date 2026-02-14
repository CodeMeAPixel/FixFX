# Changelog

All notable changes to FixFX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-14

### Added

#### JSON Validator

- **Validator Page** (`/validator`) - Full-featured JSON validator with txAdmin support
  - Generic JSON syntax validation with formatted output
  - txAdmin Discord embed JSON validation with field-level issue reporting
  - txAdmin embed config JSON validation (status strings, colors, buttons)
  - Collapsible sidebar with validation mode selector, quick templates, and txAdmin placeholder reference
  - Click-to-insert txAdmin placeholders (`{{serverName}}`, `{{statusString}}`, etc.)
  - Format/prettify and clear actions with keyboard shortcut (Ctrl+Enter)
  - Client-side fallback validation when the backend API is unreachable
  - Mobile-responsive layout with dropdown validation type selector
  - Suspense loading state with progress indicator
- **Validator Layout** - SEO metadata for `/validator` with Open Graph tags
- **Navigation** - Added JSON Validator to the Resources menu in the nav bar with Braces icon
- **API Route Documentation** - Added validator endpoint to the API index route

### Changed

#### Data Fetching & Artifacts

- **`useFetch` Hook** - Migrated from manual `useState`/`useEffect`/`AbortController` to TanStack Query (`useQuery`)
  - Automatic request deduplication, caching, and background refetching
  - Simplified error handling with typed errors (`E = Error`)
  - Query keys derived from URL and dependency array for proper cache invalidation
  - Removed manual abort controller management (handled by TanStack Query)
- **`GitHubFetcher`** - Migrated from Axios to native `fetch` API
  - Removed `axios` dependency entirely
  - Consolidated request logic into a single private `request<T>()` method
  - Uses native `AbortController` with configurable timeout
  - Proper rate limit tracking via `Headers.get()` instead of raw header objects
  - Improved error handling for 304 Not Modified responses
  - Cleaner POST/PUT/DELETE methods delegating to the shared request method
- **Query Provider** - Added TanStack Query provider for `useFetch` integration

## [1.1.0] - 2026-01-26

### Added

#### Hosting Providers & Partnerships System

- **Directory-Based Provider Structure** - Reorganized provider files into subdirectories
  - Moved from flat `provider-name.json` to `provider-name/provider.json` structure
  - Allows schemas and documentation to coexist with provider data
  - Improved file organization and maintainability
- **Provider Guidelines & Code of Conduct** - Comprehensive standards documentation (`packages/providers/GUIDELINES.md`)
  - Service quality requirements (99.5%+ uptime SLA, ≤4h support response)
  - Customer support standards (24/7 availability, documentation, responsiveness)
  - Fair pricing expectations and discount legitimacy validation
  - Technical standards for FiveM/RedM compatibility
  - Ethical business practices and code of conduct
  - Partnership application and approval workflow
  - Performance monitoring and termination clauses
- **Provider JSON Schema Validation** - Enhanced schema enforcement
  - Added `$schema` reference to all provider files pointing to `../schema.json`
  - Enables IDE schema validation for provider.json files
  - GitHub Actions validates schema compliance on pull requests
  - Ensures consistent data quality and structure
- **Trusted Hosts Documentation** - Complete reference for automated provider system
  - Usage examples for TypeScript utility functions
  - Manual provider addition process
  - Troubleshooting guide for scraper and validation
  - Fallback mechanisms and validation strategies

#### StepList Component Enhancements

- **Image Support** - Steps can now include images with positioning
  - Added `image`, `imageAlt`, and `imagePosition` props
  - Images are zoomable using fumadocs ImageZoom component
  - Supports `top`, `bottom`, `left`, `right` positioning
- **Markdown Link Support** - Descriptions now render clickable links
  - Added `parseMarkdownLinks` helper function
  - Supports standard markdown `[text](url)` syntax
- **Inline Alert Support** - Steps can include contextual alerts
  - Added `alert` prop with `type` and `message` fields
  - Supports `info`, `warning`, `success`, `error`, and `tip` types
  - Styled consistently with InfoBanner component

#### SEO and Modern Web Standards

- **LLMs.txt** - AI crawler documentation files
  - `/llms.txt` - Summary for AI models
  - `/llms-full.txt` - Comprehensive documentation for LLMs
- **AI.txt** - AI crawler guidelines and permissions
- **Humans.txt** - Site credits and team information
- **Security.txt** - Security policy in `.well-known/security.txt`
- **GPC.json** - Global Privacy Control signal in `.well-known/gpc.json`
- **OpenSearch** - Browser search integration via `/opensearch.xml`
- **Blog Feeds** - RSS, Atom, and JSON Feed support
  - `/blog/feed.xml` - RSS 2.0 feed
  - `/blog/atom.xml` - Atom 1.0 feed
  - `/blog/feed.json` - JSON Feed 1.1
- **JSON-LD Schemas** - Structured data for search engines
  - WebSite schema with SearchAction
  - Organization schema
  - SoftwareApplication schema
- **AI Crawler Rules** - Added rules for GPTBot, Claude-Web, ChatGPT-User, Anthropic-AI, PerplexityBot, Cohere-AI in robots.txt

#### Dynamic Icons

- **App Icon** - Dynamic 512x512 icon with gradient background (`app/icon.tsx`)
- **Apple Touch Icon** - Dynamic 180x180 icon for iOS (`app/apple-icon.tsx`)
- **Brand Page** - `/brand` page displaying icon with download buttons

#### Documentation

- **Discord Bot Guide** - Comprehensive txAdmin Discord bot setup documentation
  - Bot creation and permissions
  - Configuration options
  - Command reference
  - Troubleshooting section
- **Comprehensive txAdmin Documentation Suite** - 10 new in-depth guides covering all txAdmin features
  - **API Events** (`api-events.mdx`) - Complete CFX events documentation with 17 event types, properties, Lua examples, and best practices
  - **Environment Configuration** (`env-config.mdx`) - TXHOST\_\* environment variables for GSP and advanced deployments
  - **Discord Status Embed** (`discord-status.mdx`) - Custom Discord persistent status configuration with placeholders
  - **Development Guide** (`development.mdx`) - Setup, workflows, and architecture for txAdmin development
  - **In-Game Menu** (`menu.mdx`) - Menu access, ConVars, commands, and troubleshooting guide
  - **Recipe Files** (`recipe.mdx`) - Complete deployment recipe documentation with all task actions
  - **Logging System** (`logs.mdx`) - Persistent logging with file rotation and configuration
  - **Custom Server Logs** (`custom-server-log.mdx`) - Guide for logging custom commands
  - **Color Palettes** (`palettes.mdx`) - Theming and palette configuration
  - **Translation Support** (`translation.mdx`) - Contributing translations and custom locale setup
- **Guidelines Modal Enhancement** - Improved markdown link parsing in partnership guidelines
  - Added regex-based link parsing for `[text](url)` markdown syntax
  - Links render as clickable anchors with proper styling

#### GitHub Community Files

- **SECURITY.md** - Vulnerability reporting process and response timeline
- **CODE_OF_CONDUCT.md** - Community guidelines based on Contributor Covenant

#### Developer Tooling

- **Husky** - Git hooks for automated checks
  - Pre-commit hook running lint-staged
  - Commit-msg hook running commitlint
- **Lint-staged** - Run linters on staged files only
  - ESLint for JS/TS files
  - Prettier for formatting all file types
- **Commitlint** - Enforce conventional commit messages
  - Uses `@commitlint/config-conventional` preset
- **Knip** - Dead code detection
  - Configured for monorepo structure with packages
  - Custom entry points and path aliases

#### Artifacts Page Enhancements

- **Hosting Panel Version Strings** - Added Pterodactyl/Pelican version support
  - Accordion section in featured cards showing full version string (e.g., `24769-315823736cfbc085104ca0d32779311cd2f1a5a8`)
  - Quick copy button with Terminal icon on artifact list items
  - Compatible with Pterodactyl, Pelican, and similar hosting panel egg configurations
- **Artifact Stats from API** - Stats cards now show full totals from backend
  - Total, Recommended, Latest, Active, EOL counts reflect all filtered results
  - Previously only showed counts for current page

- **EOL/Deprecated Artifact Warnings** - Safety improvements for unsupported versions
  - Warning banner on deprecated/EOL artifact cards explaining download restriction
  - Link to CFX EOL documentation (https://aka.cfx.re/eol)
  - Download buttons disabled with tooltip explanation
  - Visual distinction with amber (deprecated) and red (EOL) styling

- **Accordion Component** - New Radix-based accordion component
  - Smooth expand/collapse animations
  - Accessible keyboard navigation
  - Used for hosting panel version sections

#### Hosting Page Improvements

- **Hosting Provider Card Redesign** - Enhanced provider listing with improved UX
  - Added loading state skeletons using CSS animations for performance
  - Non-blocking state transitions for data fetching
- **Navigation Enhancement** - Improved main navigation configuration
  - Hosting menu item with Server icon (green), banner, and description
  - Brand menu item with Palette icon (pink), banner, and description
  - Proper icon imports and styling consistency

### Fixed

- **EOL filter parameter** - Fixed `includeEol` not being sent when set to "No"
  - Now always sends `includeEol` parameter explicitly to backend
  - Previously only sent when true, causing backend default (true) to override UI setting

- **InfoBanner Alignment** - Fixed icon and title not being perfectly inline
  - Wrapped icon in flex container with consistent height
  - Applied matching `leading-6` to title text

- **StepList Alert Alignment** - Fixed icon and title alignment in step alerts
  - Same fix as InfoBanner using flex containers

- **ImageZoom Empty Src** - Fixed error when ImageZoom received empty src string
  - Added guard to check `step.image.trim() !== ""` before rendering
  - Added guard in docs page for markdown images with `props.src` check

- **Hero Button Consistency** - Fixed Troubleshoot Issues button arrow visibility
  - Arrow now always visible instead of appearing on hover
  - Matches Get Started button behavior

- **Guidelines Modal Component Architecture** - Fixed server/client component boundary issues
  - Removed context provider wrapper that caused hook usage errors in server components
  - Implemented direct client-side state management in hosting page
  - Fixed import paths for component libraries
  - Removed unnecessary context provider files

- **GitHub URL References** - Fixed erroneous `frontend/` directory in provider documentation links
  - Updated GUIDELINES.md to use correct GitHub repository URLs
  - Removed local folder structure references from remote URLs
  - All links now point to correct paths in main FixFX repository

- **txAdmin Documentation Link Format** - Fixed internal page links in all txAdmin docs
  - Removed `.mdx` and `.md` extensions from internal page references
  - Updated all GitHub URLs to official `citizenfx/txAdmin` repository
  - Updated Discord invite links to official server (`discord.gg/eWhDDVCpPn`)

#### Styling & CSS Enhancements

- **Comprehensive CSS System** - Major expansion of `globals.css` with reusable utilities
  - **Custom Scrollbar** - Sleek, minimal scrollbar styling with `.custom-scrollbar`
  - **Gradient Text** - Utilities: `text-gradient-blue`, `text-gradient-purple`, `text-gradient-green`, `text-gradient-orange`
  - **Glow Effects** - `glow-blue`, `glow-purple`, `glow-green`, `glow-sm` for neon-style effects
  - **Glassmorphism** - `glass`, `glass-card`, `glass-dark` for frosted glass effects
  - **Gradient Backgrounds** - `bg-mesh` (multi-color mesh), `bg-dots`, `bg-grid` patterns
  - **Card Effects** - `card-hover` with lift animation, `card-glow` with mouse-tracking radial gradient
  - **Status Badges** - `badge-recommended`, `badge-latest`, `badge-active`, `badge-deprecated`, `badge-eol`
  - **Code Block Styles** - `code-block`, `code-block-header`, `inline-code`
  - **Loading States** - `skeleton`, `skeleton-text`, `skeleton-title`, `skeleton-avatar`, `skeleton-card`
  - **Chat Interface** - `chat-bubble`, `chat-bubble-user`, `chat-bubble-assistant`, `chat-input`
  - **Contributor Styles** - `contributor-avatar` with hover ring effect, `contributor-badge`
  - **Table Styles** - Complete table wrapper with hover states
  - **Component Classes** - `artifact-card`, `native-card`, `feature-card`, `hero-badge`, `hero-title`, `hero-glow`
  - **Documentation** - `docs-callout-info`, `docs-callout-warning`, `docs-callout-danger`, `docs-callout-tip`
  - **TOC Styles** - `toc-link`, `toc-progress` for table of contents
  - **Sidebar** - `sidebar-link` with active state
  - **Utilities** - `transition-base`, `transition-slow`, `focus-ring`, `search-highlight`
  - **Z-Index Scale** - Structured z-index system from `z-behind` to `z-tooltip`

#### Animations

- **New Animation Utilities** - Smooth, performant CSS animations
  - `animate-fade-in` - Fade in effect
  - `animate-slide-up` / `animate-slide-down` - Slide animations
  - `animate-scale-in` - Scale entrance
  - `animate-float` - Floating effect (6s infinite)
  - `animate-shimmer` - Shimmer loading effect
  - `animate-gradient` - Animated gradient backgrounds
  - `animate-glow-pulse` - Pulsing glow effect
  - `animate-border-flow` - Flowing border gradient
- **Button Shine Effect** - `btn-glow` with shine animation on hover
- **Link Underline** - `link-underline` with animated underline on hover

### Changed

- Updated `txAdmin Windows Install` guide with StepList images and alerts
- Updated to `NextJS v15.5.9` as it is the latest stable `15.x` version not requiring significant changes
- Enhanced sitemap with blog posts and improved priority structure
- Updated README.md with accurate project information
- Updated CONTRIBUTING.md with correct Discord and email contacts
- Added `knip.json` configuration for dead code detection

### Fixed

- **Next.js 15 Dynamic Params** - Fixed `params` must be awaited error in `/docs/[...slug]/page.tsx`
  - Changed `params` type from `{ slug?: string[] }` to `Promise<{ slug?: string[] }>`
  - Added `const { slug } = await params;` before accessing properties
  - Aligns with Next.js 15+ requirements for dynamic route params

- **Hydration Mismatch** - Fixed React hydration warning in root layout
  - Added `suppressHydrationWarning` to `<html>` element
  - Prevents warnings from theme provider dynamically adding `dark` class and `color-scheme` style

## [1.0.0] - 2026-01-25

### Added

#### Backend Integration

- **Go Backend API Integration** - Complete frontend migration to use Go backend services
  - Artifacts API endpoint integration (`/api/artifacts`)
  - Natives API endpoint integration (`/api/natives`)
  - Contributors API endpoint integration (`/api/contributors`)
  - Source API endpoint integration (`/api/source`)
  - Environment-aware API_URL configuration using `NEXT_PUBLIC_API_URL` env var
  - Production default URL: `https://core.fixfx.wiki`
  - Development override support for local backend

#### Analytics

- **Ackee Analytics Integration** - User tracking and analytics
  - Added Ackee tracker script to root layout
  - Server: `https://ackee.bytebrush.dev`
  - Domain ID: `cda143c2-45f9-4884-96b6-9e73ffecaf15`
  - Automatic page view and interaction tracking

#### Documentation

- **API Documentation Updates** - Complete rewrite for Go backend
  - `content/docs/core/api/artifacts.mdx` - Artifacts API documentation
  - `content/docs/core/api/natives.mdx` - Natives API documentation with usage examples
  - `content/docs/core/api/contributors.mdx` - Contributors API documentation
  - Includes endpoint specifications, query parameters, and response formats
  - JavaScript, Lua, and C# usage examples

### Changed

#### Components

- **FileSource Component** - Server component that reads and displays source code files directly in documentation
  - Located at `app/components/file-source.tsx`
  - Supports syntax highlighting via DynamicCodeBlock
  - Fetches file content through secure API route
- **ImageModal Component** - Click-to-expand image viewer for better mobile experience
  - Located at `app/components/image-modal.tsx`
  - Uses React Portal to render above all content
  - Features dark overlay, close button, and optional title caption
  - Prevents body scroll when open

- **SourceCode Component** - Client wrapper for DynamicCodeBlock with custom styling
  - Located at `packages/ui/src/components/source-code.tsx`
  - Supports multiple languages with proper syntax highlighting
  - Optional title bar display

#### API Routes

- **Source API** (`/api/source`) - Securely serves file contents for documentation
  - Whitelisted paths for security (`lib/artifacts/`, `packages/`)
  - Prevents path traversal attacks
  - Returns file contents as JSON

#### Documentation

- **txAdmin Windows Installation Guide** (`content/docs/txadmin/windows/install.mdx`)
  - Complete step-by-step installation process
  - PowerShell commands for artifact download
  - Screenshots with ImageModal for better viewing
  - CFX authorization and master account setup
  - Server deployment with recipes
  - License key generation guide

- **txAdmin Windows Overview** (`content/docs/txadmin/windows/index.mdx`)
  - System requirements (hardware and software)
  - Quick overview of installation process
  - Links to detailed installation guide

- **txAdmin Config Editor Guide** (`content/docs/txadmin/configuration.mdx`)
  - Complete explanation of all server.cfg options
  - Server identity settings (sv_hostname, sv_projectName, etc.)
  - Server configuration (sv_maxclients, endpoints, etc.)
  - Resource management section
  - Admin permissions and ACE rules
  - Common configuration scenarios
  - Troubleshooting guide

- **txAdmin Server Management Guide** (`content/docs/txadmin/server-management.mdx`)
  - Dashboard overview and metrics
  - Live Console usage and commands
  - Players management and search
  - Resources management
  - Server Log and filtering
  - History and audit trail
  - Player Drops analytics
  - Whitelist management
  - Admin account creation and permissions
  - Best practices (daily, weekly, monthly tasks)
  - Troubleshooting common issues

#### Animations

- **Indeterminate Progress Animation** - Added loading animation for Progress component
  - Added `indeterminate-progress` keyframes to `tailwind.config.ts`
  - Smooth left-to-right loading animation

### Changed

#### Components

- **Progress Component** (`packages/ui/src/components/progress.tsx`)
  - Added `indeterminate` prop support
  - Uses Tailwind animation class instead of inline CSS
  - Properly handles both determinate and indeterminate states

#### Documentation Cleanup

- **vMenu Documentation** - Removed fabricated information
  - Removed fake build numbers and version requirements
  - Removed incorrect convar names that don't exist
  - Corrected feature descriptions to match actual vMenu capabilities

- **txAdmin Documentation** - Removed fabricated information
  - Removed fake build numbers and minimum version requirements
  - Removed non-existent convars and configuration options
  - Corrected setup instructions to match actual txAdmin behavior

- **ESX Framework Documentation** - Removed fabricated information
  - Removed fake version numbers and compatibility matrices
  - Removed non-existent configuration options
  - Corrected database setup instructions

- **QBCore Framework Documentation** - Removed fabricated information
  - Removed fake version numbers and build requirements
  - Removed non-existent functions and exports
  - Corrected resource dependencies

- **CFX Documentation** - Removed fabricated information
  - Removed fake artifact build numbers
  - Removed non-existent server commands
  - Corrected performance optimization tips

### Fixed

- **Progress Component Loading Animation** - Animation was not working because CSS keyframes were missing
  - Added proper keyframes to Tailwind config
  - Component now animates correctly when `value={undefined}`

- **ImageModal Positioning** - Modal was appearing in wrong position due to CSS stacking context
  - Implemented React Portal to render directly to document.body
  - Uses inline styles with high z-index to ensure proper layering
  - Prevents body scroll when modal is open

- **FileSource Component** - Initial implementation failed due to `fs` module in client bundle
  - Moved file reading to API route
  - Client component fetches via `/api/source` endpoint
  - Proper error handling and loading states

### Removed

- Removed `file-source.tsx` from `packages/ui/src/components/` (moved to `app/components/`)
- Removed fabricated documentation content across multiple files

### Security

- **Source API** includes path whitelisting to prevent unauthorized file access
- **Source API** blocks path traversal attempts (rejects paths containing `..`)

---

## Version History

| Version | Date       | Description                                                                    |
| ------- | ---------- | ------------------------------------------------------------------------------ |
| 1.0.0   | 2026-01-25 | Initial rewrite with documentation cleanup, new components, and txAdmin guides |

---
