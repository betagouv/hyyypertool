//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export function User_In_Organization_Table() {
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <section>
      <h3>
        Organisations de {moderation.users.given_name}{" "}
        {moderation.users.family_name}
      </h3>

      <div
        {...hx_urls.users[":id"].organizations.$get({
          param: { id: moderation.user_id.toString() },
          query: {},
        })}
        hx-target="this"
        hx-trigger={[
          "load",
          hx_trigger_from_body([ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED]),
        ].join(", ")}
      >
        <center>
          <Loader />
        </center>
      </div>
    </section>
  );
}
