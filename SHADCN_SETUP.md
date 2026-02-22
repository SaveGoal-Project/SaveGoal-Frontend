# Shadcn/UI Setup Guide

## ✅ Setup Complete!

I've configured Shadcn/UI for your project. Here's what was set up:

### Files Created/Updated:
- ✅ `components.json` - Shadcn configuration
- ✅ `tailwind.config.ts` - Tailwind config with Shadcn theme
- ✅ `src/lib/utils.ts` - `cn()` utility function
- ✅ `app/globals.css` - Shadcn CSS variables
- ✅ `package.json` - Added required dependencies

---

## 📦 Install Dependencies

Run this command in your terminal:

```bash
npm install
```

This will install:
- `class-variance-authority` - For component variants
- `clsx` - For conditional classes
- `tailwind-merge` - For merging Tailwind classes
- `lucide-react` - Icon library
- `tailwindcss-animate` - Animation utilities

---

## 🎨 Install Shadcn Components

After installing dependencies, you can add components using:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

Or install multiple at once:

```bash
npx shadcn@latest add button card input dialog label select textarea badge avatar dropdown-menu
```

---

## 📚 Essential Components for SaveGoal

Here are the components you'll likely need:

### Forms & Inputs
```bash
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add form
```

### Layout & Navigation
```bash
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add tabs
npx shadcn@latest add breadcrumb
npx shadcn@latest add navigation-menu
```

### Feedback & Overlays
```bash
npx shadcn@latest add dialog
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add sheet
npx shadcn@latest add popover
npx shadcn@latest add tooltip
```

### Data Display
```bash
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add progress
npx shadcn@latest add skeleton
```

### Actions
```bash
npx shadcn@latest add button
npx shadcn@latest add dropdown-menu
npx shadcn@latest add context-menu
```

---

## 🚀 Quick Start Example

After installing components, use them like this:

```tsx
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SaveGoal</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter amount" />
        <Button>Save Now</Button>
      </CardContent>
    </Card>
  );
}
```

---

## ⚠️ Note on Tailwind v4

You're using Tailwind CSS v4, which is still in development. Shadcn/UI is primarily designed for Tailwind v3. 

If you encounter issues:
1. The `tailwind.config.ts` I created should work, but you might need to adjust it
2. Consider downgrading to Tailwind v3 for better compatibility:
   ```bash
   npm install -D tailwindcss@^3 postcss autoprefixer
   ```

---

## 📖 Documentation

- [Shadcn/UI Docs](https://ui.shadcn.com)
- [Component Examples](https://ui.shadcn.com/docs/components)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Install your first component: `npx shadcn@latest add button`
3. ✅ Start building your UI components in `src/components/`

Happy coding! 🚀

