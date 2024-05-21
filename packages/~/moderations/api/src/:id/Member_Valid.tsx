//

import { hyper_ref } from "@~/app.core/html";
import { Htmx_Events, hx_include } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { Moderation_Type_Schema } from "@~/moderations.lib/Moderation_Type";
import { useContext } from "hono/jsx";
import { match } from "ts-pattern";
import { FORM_SCHEMA } from "./$procedures/validate";
import { Desicison_Context } from "./Desicison_Context";
import { ModerationPage_Context } from "./context";

//

export function Member_Valid() {
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
      {...hx_urls.moderations[":id"].$procedures.validate.$patch({
        param: { id: moderation.id.toString() },
      })}
      hx-include={hx_include([$add_domain])}
      hx-swap="none"
    >
      <LinkWithOrganization />
      <OrganizationDomain />
      <VerificationType />
      <fieldset class={base()}>
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

function LinkWithOrganization() {
  const { $add_as_internal_member, $add_as_external_member } =
    useContext(Desicison_Context);
  const { base, element, legend } = fieldset();
  const {
    moderation: {
      users: { given_name },
    },
  } = useContext(ModerationPage_Context);
  return (
    <fieldset class={base()}>
      <legend class={legend({ className: "font-bold" })}>
        Quel est son lien avec l'organisation ?
      </legend>
      <div class={element({ inline: true })}>
        <div class="fr-radio-group">
          <input
            id={$add_as_internal_member}
            name={FORM_SCHEMA.keyof().Enum.add_member}
            required
            type="radio"
            value={
              FORM_SCHEMA.shape.add_member.removeDefault().Enum.AS_INTERNAL
            }
          />
          <label class="fr-label !flex-row" for={$add_as_internal_member}>
            <span class="mx-1 capitalize">{given_name}</span> est{" "}
            <b class="mx-1">interne</b> à l'organisation 🧑‍💼
          </label>
        </div>
      </div>
      <div class={element({ inline: true })}>
        <div class="fr-radio-group">
          <input
            id={$add_as_external_member}
            name={FORM_SCHEMA.keyof().Enum.add_member}
            required
            type="radio"
            value={
              FORM_SCHEMA.shape.add_member.removeDefault().Enum.AS_EXTERNAL
            }
          />
          <label class="fr-label !flex-row" for={$add_as_external_member}>
            <span class="mx-1 capitalize">{given_name}</span> est{" "}
            <b class="mx-1">externe</b> à l'organisation 👷
          </label>
        </div>
      </div>
    </fieldset>
  );
}

function VerificationType() {
  const $nope = hyper_ref();
  const $in_liste_dirigeants_rna = hyper_ref();
  const { base, element, legend } = fieldset();
  const {
    moderation: {
      users: { given_name },
    },
    organization_member,
  } = useContext(ModerationPage_Context);

  const is_already_verified = Boolean(organization_member?.verification_type);

  return match({
    is_already_verified,
  })
    .with({ is_already_verified: true }, () => (
      <fieldset class={base()}>
        <b class="mx-1">{given_name}</b> est déjà vérifié
      </fieldset>
    ))
    .otherwise(() => {
      return (
        <fieldset class={base()}>
          <legend class={legend({ className: "font-bold" })}>
            Comment avez-vous verifié le lien avec l'organisation ?
          </legend>
          <div class={element({ inline: true })}>
            <div class="fr-radio-group">
              <input
                id={$nope}
                name={FORM_SCHEMA.keyof().Enum.verification_type}
                type="radio"
              />
              <label class="fr-label !flex-row" for={$nope}>
                Je ne sais pas 🌱
              </label>
            </div>
          </div>
          <div class={element({ inline: true })}>
            <div class="fr-radio-group">
              <input
                id={$in_liste_dirigeants_rna}
                name={FORM_SCHEMA.keyof().Enum.verification_type}
                type="radio"
                value={
                  FORM_SCHEMA.shape.verification_type.unwrap().Enum
                    .in_liste_dirigeants_rna
                }
              />
              <label class="fr-label !flex-row" for={$in_liste_dirigeants_rna}>
                <b class="mx-1">{given_name}</b> apparait dans la liste des
                dirigeants de l'organisation 🧑‍✈️
              </label>
            </div>
          </div>
        </fieldset>
      );
    });
}

function OrganizationDomain() {
  const $internal = hyper_ref();
  const $external = hyper_ref();
  const $nope = hyper_ref();
  const { base, element, legend } = fieldset();
  const {
    domain,
    moderation: {
      organizations: {
        authorized_email_domains,
        external_authorized_email_domains,
      },
    },
  } = useContext(ModerationPage_Context);

  const is_already_internal_domain = authorized_email_domains.includes(domain);
  const is_already_external_domain =
    external_authorized_email_domains.includes(domain);
  const is_known_domain =
    is_already_internal_domain || is_already_external_domain;

  return match({
    is_already_internal_domain,
    is_already_external_domain,
    is_known_domain,
  })
    .with({ is_already_internal_domain: true }, () => (
      <fieldset class={base()}>
        <b class="mx-1">{domain}</b> est un domaine interne à l'organisation 🪴
      </fieldset>
    ))
    .with({ is_already_external_domain: true }, () => (
      <fieldset class={base()}>
        <b class="mx-1">{domain}</b> est un domaine externe à l'organisation 🌳
      </fieldset>
    ))
    .otherwise(() => {
      return (
        <fieldset class={base()}>
          <legend class={legend({ className: "font-bold" })}>
            Le domaine {domain} est-il en lien avec l'organisation ?
          </legend>
          <div class={element({ inline: true })}>
            <div class="fr-radio-group">
              <input
                id={$nope}
                name={FORM_SCHEMA.keyof().Enum.add_domain}
                type="radio"
                value=""
              />
              <label class="fr-label !flex-row" for={$nope}>
                Je ne sais pas 🌱
              </label>
            </div>
          </div>
          <div class={element({ inline: true })}>
            <div class="fr-radio-group">
              <input
                id={$internal}
                name={FORM_SCHEMA.keyof().Enum.add_domain}
                type="radio"
                value={FORM_SCHEMA.shape.add_domain.unwrap().Enum.AS_INTERNAL}
              />
              <label class="fr-label !flex-row" for={$internal}>
                <span class="mx-1">{domain}</span> est{" "}
                <b class="mx-1">interne</b> à l'organisation 🪴
              </label>
            </div>
          </div>
          <div class={element({ inline: true })}>
            <div class="fr-radio-group">
              <input
                id={$external}
                name={FORM_SCHEMA.keyof().Enum.add_domain}
                type="radio"
                value={FORM_SCHEMA.shape.add_domain.unwrap().Enum.AS_EXTERNAL}
              />
              <label class="fr-label !flex-row" for={$external}>
                <span class="mx-1">{domain}</span> est{" "}
                <b class="mx-1">externe</b> à l'organisation 🌳
              </label>
            </div>
          </div>
        </fieldset>
      );
    });
}

function SendNotification() {
  const { $send_notification } = useContext(Desicison_Context);
  const { moderation } = useContext(ModerationPage_Context);
  const {
    users: { email },
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

// function AddDomain() {
//   const { $add_domain } = useContext(Desicison_Context);
//   const { domain } = useContext(ModerationPage_Context);

//   return (
//     <div class="fr-checkbox-group">
//       <input
//         id={$add_domain}
//         name={FORM_SCHEMA.keyof().Enum.add_domain}
//         type="checkbox"
//         value="true"
//       />
//       <label class="fr-label !flex-row" for={$add_domain}>
//         J’autorise le domaine <b class="mx-1">{domain}</b> pour toute
//         l’organisation
//       </label>
//     </div>
//   );
// }

// function AddAsMemberInternal() {
//   const { $add_as_internal_member } = useContext(Desicison_Context);
//   const {
//     moderation: {
//       users: { given_name },
//     },
//     organization_member,
//   } = useContext(ModerationPage_Context);
//   const is_already_internal_member = organization_member?.is_external === false;
//   return (
//     <div class="fr-radio-group">
//       <input
//         id={$add_as_internal_member}
//         name={FORM_SCHEMA.keyof().Enum.add_member}
//         required
//         type="radio"
//         value={FORM_SCHEMA.shape.add_member.removeDefault().Enum.AS_INTERNAL}
//         checked={is_already_internal_member}
//       />
//       <label class="fr-label !flex-row" for={$add_as_internal_member}>
//         Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
//         QU'INTERNE
//       </label>
//     </div>
//   );
// }

// function AddAsMemberExternal() {
//   const { $add_as_external_member } = useContext(Desicison_Context);
//   const {
//     moderation: {
//       users: { given_name },
//     },
//     organization_member,
//   } = useContext(ModerationPage_Context);

//   const is_already_external_member = organization_member?.is_external === true;
//   return (
//     <div class="fr-radio-group">
//       <input
//         id={$add_as_external_member}
//         name={FORM_SCHEMA.keyof().Enum.add_member}
//         required
//         type="radio"
//         value={FORM_SCHEMA.shape.add_member.removeDefault().Enum.AS_EXTERNAL}
//         checked={is_already_external_member}
//       />
//       <label class="fr-label !flex-row" for={$add_as_external_member}>
//         Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
//         QU'EXTERNE
//       </label>
//     </div>
//   );
// }
