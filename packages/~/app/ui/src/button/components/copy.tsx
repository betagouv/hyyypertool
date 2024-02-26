//

import type { PropsWithChildren } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { button } from "..";

//

export function CopyButton(
  props: PropsWithChildren<{
    text: string;
    variant?: VariantProps<typeof button>;
  }>,
) {
  const { text, children, variant } = props;
  return (
    <button
      _="
      on click
        set text to @data-text
        js(me, text)
          if ('clipboard' in window.navigator) {
            navigator.clipboard.writeText(text)
          }
        end"
      class={button(variant)}
      data-text={text}
    >
      📋 {children}
    </button>
  );
}
