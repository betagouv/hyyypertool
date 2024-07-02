//

import { Htmx_Events, hx_include } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { Moderation_Type_Schema } from "@~/moderations.lib/Moderation_Type";
import { useContext } from "hono/jsx";
import { FORM_SCHEMA } from "./$procedures/validate";
import { Desicison_Context } from "./Desicison_Context";
import { ModerationPage_Context } from "./context";

//

export async function Member_Valid() {
  const { $accept, $add_domain, $decision_form } =
    useContext(Desicison_Context);
  const { moderation } = useContext(ModerationPage_Context);
  const { base, element } = fieldset();

  return (
    <form
      _={`
      on load if #${$accept}.checked then remove @hidden end
      on change from #${$decision_form}
        if #${$accept}.checked then remove @hidden else add @hidden end
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        go to the top of body smoothly
        wait 2s
        go back
      `}
      hidden
      {...await hx_urls.moderations[":id"].$procedures.validate.$patch({
        param: { id: moderation.id.toString() },
      })}
      hx-include={hx_include([$add_domain])}
      hx-swap="none"
    >
      <fieldset class={base()}>
        <div class={element()}>
          <AddDomain />
        </div>
        <div class={element()}>
          <AddAsMemberInternal />
        </div>
        <div class={element()}>
          <AddAsMemberExternal />
        </div>
        <div class={element()}>
          <SendNotification />
        </div>
        <div class={element({ class: "mt-8" })}>
          <button class={button()} type="submit">
            Terminer
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function SendNotification() {
  const { $send_notification } = useContext(Desicison_Context);
  const { moderation } = useContext(ModerationPage_Context);
  const {
    user: { email },
  } = moderation;

  return (
    <div class="fr-checkbox-group">
      <input
        id={$send_notification}
        name={FORM_SCHEMA.keyof().Enum.send_notitfication}
        type="checkbox"
        value="true"
        checked={
          Moderation_Type_Schema.parse(moderation.type, {
            path: ["moderation", "type"],
          }) !== Moderation_Type_Schema.Enum.non_verified_domain
        }
      />
      <label class="fr-label !flex-row" for={$send_notification}>
        Notifier <b class="mx-1">{email}</b> du traitement de la modération.
      </label>
    </div>
  );
}

function AddDomain() {
  const { $add_domain } = useContext(Desicison_Context);
  const { domain } = useContext(ModerationPage_Context);

  return (
    <div class="fr-checkbox-group">
      <input
        id={$add_domain}
        name={FORM_SCHEMA.keyof().Enum.add_domain}
        type="checkbox"
        value="true"
      />
      <label class="fr-label !flex-row" for={$add_domain}>
        J’autorise le domaine <b class="mx-1">{domain}</b> pour toute
        l’organisation
      </label>
    </div>
  );
}

function AddAsMemberInternal() {
  const { $add_as_internal_member } = useContext(Desicison_Context);
  const {
    moderation: {
      user: { given_name },
    },
    organization_member,
  } = useContext(ModerationPage_Context);
  const is_already_internal_member = organization_member
    ? organization_member.is_external === false
    : true;
  return (
    <div class="fr-radio-group">
      <input
        id={$add_as_internal_member}
        name={FORM_SCHEMA.keyof().Enum.add_member}
        required
        type="radio"
        value={FORM_SCHEMA.shape.add_member.removeDefault().Enum.AS_INTERNAL}
        checked={is_already_internal_member}
      />
      <label class="fr-label !flex-row" for={$add_as_internal_member}>
        Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
        QU'INTERNE
      </label>
    </div>
  );
}

function AddAsMemberExternal() {
  const { $add_as_external_member } = useContext(Desicison_Context);
  const {
    moderation: {
      user: { given_name },
    },
    organization_member,
  } = useContext(ModerationPage_Context);

  const is_already_external_member = organization_member?.is_external === true;
  return (
    <div class="fr-radio-group">
      <input
        id={$add_as_external_member}
        name={FORM_SCHEMA.keyof().Enum.add_member}
        required
        type="radio"
        value={FORM_SCHEMA.shape.add_member.removeDefault().Enum.AS_EXTERNAL}
        checked={is_already_external_member}
      />
      <label class="fr-label !flex-row" for={$add_as_external_member}>
        Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
        QU'EXTERNE
      </label>
    </div>
  );
}
