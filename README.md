# SurveyFlow Hub

SurveyFlow — Frontend Development Specification

Project

You are building SurveyFlow, a modern Survey Management Web Application.

This project serves as:

A university final-year software engineering project.

A professional portfolio project.

The application should feel like a polished commercial SaaS platform rather than a student assignment.

The design should be clean, modern, minimal, and highly professional.

Frontend Only (Very Important)

This project is frontend only.

I will build the backend separately using Spring Boot.

Do NOT:

Build backend logic.

Create Express, Node.js, or Spring Boot code.

Create fake databases.

Mock API responses.

Invent REST endpoints.

Guess request or response payloads.

Hardcode fake business data.

Whenever backend integration is required, simply leave a concise comment indicating where the API call will be made.

Example:

// TODO: Integrate Spring Boot endpoint for fetching surveys.

Do not implement anything beyond the frontend.

Technology Stack

Use only the following technologies.

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Radix UI

lucide-react

Do not introduce additional frameworks or libraries unless absolutely necessary.

If another dependency is required, stop and ask for approval first.

Design Goal

Build an interface that resembles modern SaaS applications such as:

Notion

Linear

GitHub

Vercel Dashboard

Stripe Dashboard

Focus on:

Clean layouts

Excellent spacing

Professional typography

Simple color palette

Smooth interactions

Consistent components

Accessibility

Responsive design

Every screen should feel like it belongs to one cohesive design system.

Global UI Requirements

Every page must include:

Responsive layouts

Loading states

Empty states

Error states

Skeleton loaders where appropriate

Hover animations

Focus states

Keyboard accessibility

Meaningful copywriting

Consistent spacing

Accessible forms

Mobile support

Tablet support

Desktop support

Every component should feel polished.

Application Pages

1. Landing Page

Purpose:

Introduce SurveyFlow and encourage users to sign up.

Include:

Hero section

Navigation bar

Feature highlights

Benefits section

Statistics section

Testimonials section

FAQ section

Call-to-action section

Footer

2. Authentication

Login

Include:

Email

Password

Remember me

Forgot password

Login button

Register

Include:

Full name

Email

Password

Confirm password

Terms agreement

Create account button

Forgot Password

Include:

Email input

Send reset button

Success message state

Dashboard

Dashboard should provide a professional overview.

Include cards for:

Total Surveys

Active Surveys

Responses Collected

Draft Surveys

Include:

Recent surveys table

Quick actions

Recent activity

Empty state for new users

Survey Management

Users should be able to manage surveys.

Include:

Survey list

Search

Filters

Status badges

Pagination UI

Create survey button

Each survey card or row should display:

Title

Status

Created date

Responses

Last updated

Actions:

View

Edit

Duplicate

Delete

Create Survey

Build a professional survey builder interface.

Support adding questions such as:

Short text

Long text

Multiple choice

Checkbox

Dropdown

Rating

Date

Email

Number

Users should be able to:

Add questions

Remove questions

Reorder questions

Edit question titles

Mark required questions

The interface should be intuitive and clean.

Survey Details

Display:

Survey information

Questions

Status

Creation date

Last updated

Total responses

Provide actions for:

Edit

Publish

Archive

Delete

Responses

Display collected responses in a clean table.

Include:

Search

Filters

Pagination

Export button (UI only)

Empty state

Analytics

Professional analytics dashboard containing:

Response trends

Completion rate

Survey performance

Summary cards

Charts (frontend visualization only)

Do not implement backend analytics.

User Profile

Include:

Profile information

Change password form

Notification preferences

Account settings

Settings

Include:

General settings

Theme preferences

Account preferences

Notification settings

Shared Components

Build reusable components wherever appropriate.

Examples:

Buttons

Inputs

Select menus

Dialogs

Drawers

Cards

Tables

Badges

Tabs

Breadcrumbs

Pagination

Empty states

Loading components

Error components

Skeleton loaders

Search bar

Page headers

Avoid duplicated code.

Coding Standards

Always write production-quality TypeScript.

Requirements:

Strong typing

Reusable components

Clean architecture

Modular design

Semantic HTML

Accessibility

Proper naming conventions

Consistent folder organization

Never:

Duplicate code

Leave placeholder implementations

Leave unfinished UI

Use poor naming

Ignore responsiveness

Development Workflow

Build the application feature-by-feature.

For every feature:

Explain the architecture.

List every file that will be created or modified.

Explain why each file changes.

Generate the complete implementation.

Verify TypeScript.

Verify imports.

Verify responsiveness.

Summarize the completed work.

Continue to the next feature automatically unless I instruct otherwise.

Only modify files related to the current feature.

Do not refactor unrelated parts of the project.

Final Goal

The finished application should look like a real commercial survey platform that could confidently be demonstrated to university lecturers, recruiters, or potential employers.

Prioritize quality over speed.

Write clean, maintainable, scalable frontend code throughout.

Begin Immediately

Start building the application now.

Begin with the overall application layout, shared design system, navigation structure, and reusable UI components that will be used across the entire application.

After completing each feature, verify the implementation before proceeding to the next one.

Continue iteratively until the entire frontend is complete, unless I explicitly instruct you to stop or change direction.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cc34ef2c-2cd7-4ab2-81cc-16463c6adcec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
