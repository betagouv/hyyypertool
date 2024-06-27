//

import type { UserInfoVariables_Context } from "@~/app.middleware/set_userinfo";
import { urls } from "@~/app.urls";
import type { PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Root_Layout } from "./root";

//
export function Main_Layout({ children }: PropsWithChildren) {
  const {
    var: { userinfo },
  } = useRequestContext<UserInfoVariables_Context>();
  const username = userinfo_to_username(userinfo);
  return (
    <Root_Layout>
      <div class="flex min-h-full flex-grow flex-col">
        <header role="banner" class="fr-header">
          <div class="fr-header__body">
            <div class="fr-container">
              <div class="fr-header__body-row">
                <Brand />
                <Tools username={username} />
              </div>
            </div>
            {/*  */}
          </div>

          <div class="fr-header__menu fr-modal">
            <div class="fr-container">
              <Nav />
            </div>
          </div>
        </header>
        <div class="relative flex flex-1 flex-col">{children}</div>
      </div>
    </Root_Layout>
  );
}

export function userinfo_to_username(userinfo: {
  given_name: string;
  usual_name: string;
}) {
  const { given_name, usual_name } = userinfo;
  return `${given_name} ${usual_name}`;
}

//

function Brand() {
  return (
    <div class="fr-header__brand fr-enlarge-link">
      <div class="fr-header__brand-top">
        <div class="fr-header__logo">
          <p class="fr-logo">
            République
            <br />
            Française
          </p>
        </div>
      </div>
      <div class="fr-header__service">
        <a href="/" title="Accueil ">
          <p class="fr-header__service-title">Hyyypertool</p>
        </a>
        <p class="fr-header__service-tagline">hyyyyyyyypertool</p>
      </div>
    </div>
  );
}

function Tools({ username }: { username?: string | undefined }) {
  return (
    <div class="fr-header__tools">
      <div class="fr-header__tools-links">
        <ul class="fr-btns-group">
          <li>
            <a
              class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-fi-logout-box-r-line fr-btn--icon-left"
              href={urls.auth.logout.$url().pathname}
            >
              {username}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav
      class="fr-nav"
      id="navigation-494"
      role="navigation"
      aria-label="Menu principal"
    >
      <ul class="fr-nav__list">
        <li class="fr-nav__item">
          <a
            class="fr-nav__link"
            href={urls.moderations.$url().pathname}
            target="_self"
          >
            Moderations
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            class="fr-nav__link"
            href={urls.users.$url().pathname}
            target="_self"
          >
            Utilisateurs
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            class="fr-nav__link"
            href={urls.organizations.$url().pathname}
            target="_self"
          >
            Organisations
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            class="fr-nav__link"
            href={urls.organizations.domains.$url().pathname}
            target="_self"
          >
            Domaines à verifier
          </a>
        </li>
      </ul>
    </nav>
  );
}
