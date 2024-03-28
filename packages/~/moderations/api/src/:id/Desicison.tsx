//

import { fieldset } from "@~/app.ui/form";
import { useContext } from "hono/jsx";
import { Desicison_Context } from "./Desicison_Context";

//

export function Desicison() {
  const { $accept, $decision_form, $reject } = useContext(Desicison_Context);
  const { base, element, legend } = fieldset();

  return (
    <form action="javascript:void(0);" id={$decision_form}>
      <fieldset class={base()}>
        <legend class={legend({ className: "font-bold" })}>
          Voulez-vous autoriser ce membre ?
        </legend>
        <div class={element({ inline: true })}>
          <div class="fr-radio-group">
            <input type="radio" id={$accept} name="desicison" />
            <label class="fr-label" for={$accept}>
              Je valide ce membre ✅
            </label>
          </div>
        </div>
        <div class={element({ inline: true })}>
          <div class="fr-radio-group">
            <input type="radio" id={$reject} name="desicison" />
            <label class="fr-label" for={$reject}>
              Je refuse ce membre ❌
            </label>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
