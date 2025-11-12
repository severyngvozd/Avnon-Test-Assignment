# Angular Budget Builder - Project Index

**Project**: Angular 20 Budget Builder with Server-Side Rendering (SSR)
**Version**: 0.0.0
**Framework**: Angular 20.3.0 + Standalone Components
**Styling**: TailwindCSS 4.x + SCSS
**Testing**: Jasmine + Karma

---

## Project Structure

```
src/
├── main.ts                          # Browser entry point
├── main.server.ts                   # SSR entry point
├── server.ts                        # Express server for SSR
├── index.html                       # Root HTML template
├── styles.scss                      # Global styles
├── app/
│   ├── app.ts                       # Root component
│   ├── app.html                     # Root template
│   ├── app.scss                     # Root styles
│   ├── app.config.ts                # App configuration & providers
│   ├── app.config.server.ts         # Server config
│   ├── app.routes.ts                # Routing (currently empty)
│   ├── app.routes.server.ts         # Server routing
│   ├── app.spec.ts                  # Root component tests
│   │
│   ├── core/
│   │   ├── models/                  # TypeScript interfaces & types
│   │   │   ├── budget-state.models.ts    # BudgetState, BudgetTotals interfaces
│   │   │   ├── category.models.ts       # BudgetCategory, DEFAULT_*_CATEGORIES
│   │   │   ├── cell.models.ts          # BudgetCell, CellPosition, MonthYear
│   │   │   ├── context-menu.models.ts  # ContextMenu interfaces
│   │   │   └── index.ts                 # Barrel export
│   │   │
│   │   ├── enums/
│   │   │   └── keyboard.enums.ts        # KeyboardAction, KeyboardKey enums
│   │   │
│   │   ├── services/
│   │   │   ├── keyboard-service/
│   │   │   │   ├── keyboard.service.ts      # Keyboard navigation handler
│   │   │   │   └── keyboard.service.spec.ts
│   │   │   └── context-menu-service/
│   │   │       ├── context-menu.service.ts      # Right-click menu handler
│   │   │       └── context-menu.service.spec.ts
│   │   │
│   │   └── utils/
│   │       ├── math.util.ts              # roundToTwoDecimals, sumArray
│   │       ├── math.util.spec.ts
│   │       ├── month-range.util.ts       # getMonthsBetween, formatMonthYear
│   │       └── month-range.util.spec.ts
│   │
│   ├── state/
│   │   ├── budget.store.ts              # Central state management (Signals)
│   │   └── budget.store.spec.ts
│   │
│   ├── features/
│   │   └── budget/
│   │       ├── budget-builder.component.ts      # Main container
│   │       ├── budget-builder.component.html
│   │       └── budget-builder.component.spec.ts
│   │       │
│   │       └── components/
│   │           ├── month-range-picker/          # Date range selector
│   │           │   ├── month-range-picker.component.ts
│   │           │   └── month-range-picker.component.html
│   │           │
│   │           └── budget-grid/                 # Main grid display
│   │               ├── budget-grid.component.ts
│   │               ├── budget-grid.component.html
│   │               ├── budget-category-row/     # Category rows with cells
│   │               │   ├── budget-category-row.component.ts
│   │               │   └── budget-category-row.component.html
│   │               ├── budget-cell/             # Editable budget cell
│   │               │   ├── cell.component.ts
│   │               │   ├── cell.component.html
│   │               │   └── cell.component.spec.ts
│   │               ├── budget-actions-row/      # Action buttons
│   │               ├── budget-opening-balance-row/
│   │               ├── budget-closing-balance-row/
│   │               ├── budget-profit-loss-row/
│   │               ├── budget-total-row/
│   │               ├── budget-section-header/
│   │               └── context-menu/            # Right-click menu
│   │
│   └── shared/
│       ├── directives/
│       │   ├── autofocus.directive.ts           # Auto-focus on element mount
│       │   ├── contextmenu.directive.ts         # Cell context menu trigger
│       │   └── category-contextmenu.directive.ts
│       │
│       └── ui/
│           ├── button/                          # Reusable button
│           └── icon/                            # Icon component
│
├── public/                          # Static assets
├── dist/                           # Build output
│   └── test/
│       ├── browser/                # Client-side build
│       └── server/
│           └── server.mjs          # Compiled Express server
│
├── angular.json                    # Angular CLI config
├── tsconfig.json                   # TypeScript config
├── tsconfig.app.json               # App TypeScript config
├── tsconfig.spec.json              # Test TypeScript config
├── package.json                    # Dependencies & npm scripts
├── README.md                       # CLI-generated documentation
└── CLAUDE.md                       # Development guidelines
```

---

## Entry Points

### Browser Application
- **File**: `/src/main.ts`
- **Purpose**: Bootstraps Angular app using `bootstrapApplication()`
- **Config**: Loads `appConfig` from `app.config.ts`
- **Flow**: `main.ts` → `App` component → `BudgetBuilderComponent`

### Server-Side Rendering (SSR)
- **Express Server**: `/src/server.ts`
- **Main Entry**: `/src/main.server.ts`
- **Port**: `4000` (or `PORT` env var)
- **Purpose**: Serves pre-rendered HTML from Express server
- **Build Output**: `dist/test/server/server.mjs`
- **Command**: `npm run serve:ssr:test` or `node dist/test/server/server.mjs`

---

## State Management Architecture

### BudgetStore (`src/app/state/budget.store.ts`)
**Singleton Injectable Service** - Central state using Angular Signals

#### Signals (Reactive State)
```typescript
const state = signal<BudgetState>({
  categories: [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES],
  cells: Map<string, BudgetCell>(),
  startPeriod: { month: 0, year: 2024 },
  endPeriod: { month: 11, year: 2024 },
  focusedCell: null,
  openingBalance: 0
})
```

#### Computed Signals (Derived State)
- `categories`, `cells`, `startPeriod`, `endPeriod`, `focusedCell`, `openingBalance`
- `months` - Date range between start/end periods
- `incomeCategories` - Filtered & sorted income
- `expenseCategories` - Filtered & sorted expenses
- `totals` - Income, expense, profit/loss, closing balance per month

#### Key Methods
| Method | Purpose |
|--------|---------|
| `getCellValue(categoryId, month)` | Get numeric value for cell |
| `setCellValue(categoryId, month, value)` | Update cell (rounds to 2 decimals) |
| `applyToAllMonths(categoryId, month)` | Copy cell value to all months |
| `addCategory(name, type, parentId)` | Add new category with auto-order |
| `addSubcategory(afterCategoryId)` | Add category below another |
| `setStartPeriod(period)` | Update period start |
| `setEndPeriod(period)` | Update period end |
| `setFocusedCell(position)` | Track focused cell for keyboard nav |
| `setOpeningBalance(balance)` | Set starting balance |
| `deleteCategory(categoryId)` | Remove category & its cells |

#### Cell Key Format
Composite key: `${categoryId}-${year}-${month}`

---

## Core Data Models

### BudgetCategory
```typescript
interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parentId: 'income' | 'expenses';
  order: number;
  isParent: boolean;
}
```

### BudgetCell
```typescript
interface BudgetCell {
  categoryId: string;
  month: number;
  year: number;
  value: number;
}
```

### MonthYear
```typescript
interface MonthYear {
  month: number;  // 0-11
  year: number;   // YYYY
}
```

### CellPosition
```typescript
interface CellPosition {
  categoryId: string;
  month: number;
  year: number;
}
```

### BudgetState
```typescript
interface BudgetState {
  categories: BudgetCategory[];
  cells: Map<string, BudgetCell>;
  startPeriod: MonthYear;
  endPeriod: MonthYear;
  focusedCell: CellPosition | null;
  openingBalance: number;
}
```

### BudgetTotals
```typescript
interface BudgetTotals {
  incomeTotal: Map<string, number>;
  expenseTotal: Map<string, number>;
  profitLoss: Map<string, number>;
  openingBalance: number;
  closingBalance: Map<string, number>;
}
```

---

## Key Components & Responsibilities

### BudgetBuilderComponent
**Location**: `src/app/features/budget/budget-builder.component.ts`
- **Role**: Main container component
- **Responsibilities**:
  - Display month range picker
  - Display budget grid
  - Handle period changes
- **Dependencies**: `BudgetStore`
- **Change Detection**: `OnPush`

### BudgetGridComponent
**Location**: `src/app/features/budget/components/budget-grid/budget-grid.component.ts`
- **Role**: Core grid display orchestrator
- **Responsibilities**:
  - Render income & expense category rows
  - Manage cell value changes & focus
  - Handle keyboard navigation
  - Coordinate action buttons
  - Display totals, balances, profit/loss
- **Dependencies**: `BudgetStore`, `KeyboardService`
- **Change Detection**: `OnPush`

### BudgetCellComponent
**Location**: `src/app/features/budget/components/budget-grid/budget-cell/cell.component.ts`
- **Role**: Individual editable cell
- **Responsibilities**:
  - Display & edit cell value
  - Handle keyboard events
  - Manage focus state
  - Emit value changes
- **Input**: `categoryId`, `month`, `value`
- **Output**: `valueChange`, `focused`, `keyDown`
- **Change Detection**: `OnPush`

### BudgetCategoryRowComponent
**Location**: `src/app/features/budget/components/budget-grid/budget-category-row/`
- **Role**: Row container for a category
- **Responsibilities**:
  - Render category name
  - Display cells for each month
  - Handle row-level context menu
  - Propagate cell events

### MonthRangePickerComponent
**Location**: `src/app/features/budget/components/month-range-picker/`
- **Role**: Date range selector
- **Responsibilities**:
  - Allow start/end month selection
  - Emit period changes
  - Display formatted dates

### Other Row Components
- `BudgetOpeningBalanceRowComponent` - Opening balance display & edit
- `BudgetTotalRowComponent` - Total income/expense per month
- `BudgetProfitLossRowComponent` - Profit/loss calculation display
- `BudgetClosingBalanceRowComponent` - Closing balance display
- `BudgetActionsRowComponent` - Action buttons (add categories)
- `BudgetSectionHeaderComponent` - Income/expense section headers

### Shared UI Components
- `ButtonComponent` - Reusable button
- `IconComponent` - Icon renderer

---

## Services & Utilities

### KeyboardService
**Location**: `src/app/core/services/keyboard-service/keyboard.service.ts`
- **Role**: Keyboard navigation handler
- **Key Method**: `handleKeyDown(event, position): KeyboardAction`
- **Supported Keys**:
  - Arrow Up/Down: Move between categories
  - Arrow Left/Right: Move between months
  - Tab/Shift+Tab: Month navigation
  - Enter: Add subcategory
  - Ctrl/Cmd+Enter: Add subcategory while editing
- **Returns**: `KeyboardAction` enum

### ContextMenuService
**Location**: `src/app/core/services/context-menu-service/context-menu.service.ts`
- **Role**: Right-click context menu management
- **Responsibilities**: Track menu position & visibility

### Math Utilities
**Location**: `src/app/core/utils/math.util.ts`
- `roundToTwoDecimals(value)` - Format numbers to 2 decimals
- `sumArray(values)` - Sum numeric array

### Month Range Utilities
**Location**: `src/app/core/utils/month-range.util.ts`
- `getMonthsBetween(start, end)` - Generate month array between dates
- `formatMonthYear(month)` - Format for display (e.g., "Jan 2024")
- `getMonthKey(month)` - Generate map key for month

---

## Shared Directives

### AutofocusDirective
**Location**: `src/app/shared/directives/autofocus.directive.ts`
- **Purpose**: Auto-focus element on mount
- **Usage**: `<input appAutofocus>`

### ContextmenuDirective
**Location**: `src/app/shared/directives/contextmenu.directive.ts`
- **Purpose**: Trigger context menu on right-click
- **Usage**: `<div appContextmenu (contextmenu)="handler($event)">`

### CategoryContextmenuDirective
**Location**: `src/app/shared/directives/category-contextmenu.directive.ts`
- **Purpose**: Category-specific context menu

---

## Available npm Scripts

```json
{
  "ng": "ng",
  "start": "ng serve",                    # Dev server (localhost:4200)
  "build": "ng build",                    # Production build
  "watch": "ng build --watch --configuration development",
  "test": "ng test",                      # Run unit tests (Karma)
  "serve:ssr:test": "node dist/test/server/server.mjs"  # SSR server
}
```

### Run Single Test
```bash
ng test --include='**/filename.spec.ts'
```

---

## Testing Setup

### Test Framework
- **Runner**: Karma + Jasmine 5.9
- **Browsers**: Chrome (default)
- **Configuration**: `angular.json` → `test` architect section

### Test Files Location
Colocated with implementation files: `*.spec.ts`

**Current Test Coverage**:
- `src/app/app.spec.ts`
- `src/app/state/budget.store.spec.ts`
- `src/app/features/budget/budget-builder.component.spec.ts`
- `src/app/features/budget/components/budget-grid/budget-cell/cell.component.spec.ts`
- `src/app/core/services/keyboard-service/keyboard.service.spec.ts`
- `src/app/core/services/context-menu-service/context-menu.service.spec.ts`
- `src/app/core/utils/math.util.spec.ts`
- `src/app/core/utils/month-range.util.spec.ts`

---

## Dependencies Overview

### Core Angular (v20.3.0)
- `@angular/core` - Framework core
- `@angular/common` - Common utilities
- `@angular/platform-browser` - Browser module
- `@angular/platform-server` - SSR module
- `@angular/compiler` - Template compiler
- `@angular/forms` - Reactive forms
- `@angular/router` - Routing (configured but empty)

### Build & Styling
- `@angular/build` - Build toolchain
- `@angular/ssr` - Server-side rendering
- `tailwindcss` - Utility-first CSS
- `@tailwindcss/postcss` - PostCSS plugin
- `postcss` - CSS processor

### Server & Utilities
- `express` ^5.1.0 - Web framework for SSR
- `rxjs` ~7.8.0 - Reactive programming
- `tslib` - TypeScript helper library
- `zone.js` - Angular zone management

### Development Tools
- `@angular/cli` - CLI tooling
- `@angular/compiler-cli` - Template compilation
- `typescript` ~5.9.2 - TypeScript compiler
- `karma` - Test runner
- `jasmine-core` - Test framework
- `@types/node`, `@types/jasmine`, `@types/express` - Type definitions

---

## Configuration Files

### angular.json
- **Project**: `test` (application)
- **Source Root**: `src`
- **Output**: `dist/test`
- **SSR Entry**: `src/server.ts`
- **Styles**: `src/styles.scss`
- **Inline Styles**: SCSS

### tsconfig.json
- **Target**: ES2022
- **Lib**: ES2022, DOM, Workers
- **Module**: ES2022
- **Strict**: true

### package.json
- **Prettier**: printWidth 100, singleQuote true
- **Angular HTML Parser**: angular

---

## Calculation Logic

### Income Calculation
Sum all income categories for each month

### Expense Calculation
Sum all expense categories for each month

### Profit/Loss
`incomeTotal - expenseTotal` (rounded to 2 decimals)

### Closing Balance Cascade
```
Month 1: openingBalance + profitLoss[Month 1]
Month 2: closingBalance[Month 1] + profitLoss[Month 2]
Month N: closingBalance[Month N-1] + profitLoss[Month N]
```

---

## Default Categories

### Income (5 categories)
1. General Income
2. Sales
3. Commission
4. Training
5. Consulting

### Expenses (4 categories)
1. Operational Expenses
2. Management Fees
3. Cloud Hosting
4. Salaries & Wages

---

## Build & Deployment

### Development Build
```bash
npm start  # → ng serve on localhost:4200
```

### Production Build
```bash
npm run build  # → dist/test/ with browser & server outputs
```

### SSR Server
```bash
npm run serve:ssr:test  # → Node Express server on port 4000
```

**Output Structure**:
- `dist/test/browser/` - Client-side bundle
- `dist/test/server/server.mjs` - Server bundle

---

## Architecture Highlights

1. **Standalone Components**: All components use Angular's standalone API
2. **Signals-Based State**: BudgetStore uses Angular signals for reactivity
3. **OnPush Detection**: All components use OnPush change detection for performance
4. **Dependency Injection**: `inject()` function instead of constructors
5. **Native Control Flow**: `@if`, `@for`, `@switch` instead of structural directives
6. **Composite Keys**: Cells indexed as `categoryId-year-month` for efficient lookup
7. **Two-Decimal Precision**: All monetary values use `roundToTwoDecimals()`
8. **SSR Support**: Full server-side rendering with Angular SSR module
9. **Keyboard Navigation**: Integrated keyboard service for navigation
10. **Context Menus**: Right-click menu support via custom directive & service

---

**Last Updated**: November 2024
**Framework**: Angular 20.3.0 Standalone Components
**License**: Private
