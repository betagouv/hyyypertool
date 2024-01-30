//

import { tv } from "tailwind-variants";

//

export const tag = tv({
  base: "fr-tag",
  variants: {
    size: {
      sm: "fr-tag-sm",
      md: "fr-tag-md",
      lg: "fr-tag-lg",
    },
    color: {
      primary: "fr-tag-primary",
      secondary: "fr-tag-secondary",
      success: "fr-tag-success",
      danger: "fr-tag-danger",
      warning: "fr-tag-warning",
      info: "fr-tag-info",
      light: "fr-tag-light",
      dark: "fr-tag-dark",
    },
  },
});

export const tag_group = tv({
  base: "fr-tag-group",
});

export const toggle_pressed = `
  on click
    toggle [@aria-pressed=true]
` as const;
