# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 budget builder application with server-side rendering (SSR) support. The app allows users to create and manage budget categories, enter monthly values, and track opening/closing balances with profit/loss calculations.

## Development Commands

```bash
# Start development server
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build

# Run unit tests with Karma
npm test
# or
ng test

# Watch mode for development
npm run watch

# Start SSR server (after building)
npm run serve:ssr:test
```

## Architecture

### State Management
- Uses Angular signals for reactive state management via `BudgetStore` (src/app/state/budget.store.ts)
- Store manages: categories, cells (budget values), date ranges, focused cell, opening balance
- All state updates use `signal.update()` or `signal.set()`, never `mutate()`
- Computed signals derive totals (income, expense, profit/loss, closing balance)

### Project Structure
```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces and types
│   ├── services/        # Injectable services (keyboard, context-menu)
│   ├── enums/          # Enum definitions
│   └── utils/          # Pure utility functions (math, month-range)
├── features/
│   └── budget/         # Budget feature module
│       └── components/ # Feature-specific components
├── shared/
│   ├── directives/     # Reusable directives (autofocus, contextmenu)
│   └── ui/             # Reusable UI components (button, icon)
└── state/              # Global state management (BudgetStore)
```

### Key Components
- `BudgetBuilderComponent`: Main container component for budget feature
- `BudgetGridComponent`: Displays the budget grid with categories and cells
- `BudgetCellComponent`: Individual editable cell with keyboard navigation
- `MonthRangePickerComponent`: Date range selector for budget periods

### Services
- `BudgetStore`: Central state management using signals
- `KeyboardService`: Handles keyboard navigation (arrows, tab, enter)
- `ContextMenuService`: Manages right-click context menus for cells and categories

### Models
- `BudgetCategory`: Income/expense categories with parent-child relationships
- `BudgetCell`: Individual cell values for category/month combinations
- `BudgetState`: Complete state shape including categories, cells, periods
- `BudgetTotals`: Computed totals (income, expense, profit/loss, balances)

## Framework Guidelines

### Angular Patterns
- All components are standalone (default, no `standalone: true` needed)
- Use `input()` and `output()` functions instead of decorators
- Use signals (`signal()`, `computed()`) for state, not observables where possible
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on all components
- Use `inject()` function for dependency injection, not constructor injection
- Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives

### Styling
- Uses TailwindCSS 4.x via PostCSS
- SCSS for component styles when needed
- Inline templates preferred for small components

### Code Quality
- Follow .cursor/rules: angular.mdc, clean-code.mdc, code-quality.mdc
- No magic numbers - use named constants
- Functions should have single responsibility
- Extract repeated code into utilities
- Make changes file-by-file
- No whitespace-only changes or apologies in responses

### Testing
- Jasmine + Karma for unit tests
- Test files colocated with implementation (*.spec.ts)
- Run single test: `ng test --include='**/filename.spec.ts'`

## Important Implementation Details

### Cell Keys
Budget cells are stored in a Map with composite keys: `${categoryId}-${year}-${month}`

### Calculations
- All monetary values rounded to 2 decimals using `roundToTwoDecimals()`
- Totals calculated per month by summing category values
- Closing balance cascades: `previousClosing + currentProfitLoss`

### Keyboard Navigation
- Arrow keys: Navigate between cells
- Tab/Shift+Tab: Move right/left
- Enter: Add subcategory below current row
- Ctrl/Cmd+Enter: Add subcategory while editing

### Category Management
- Categories have `type` (income/expense), `parentId`, and `order`
- Adding categories maintains order sequence
- Deleting categories removes associated cells and clears focus if needed

## Prettier Configuration
```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [{ "files": "*.html", "options": { "parser": "angular" } }]
}
```

## SSR Configuration
- Entry point: src/server.ts
- Server config: src/app/app.config.server.ts
- Build output: dist/test/server/server.mjs
