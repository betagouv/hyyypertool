declare const app: import("hono/hono-base").HonoBase<
  import("@~/app.middleware/set_nonce").NonceVariables_Context &
    import("@~/app.middleware/set_config").ConfigVariables_Context &
    import("@~/app.middleware/set_userinfo").UserInfoVariables_Context,
  {
    "/organizations/:id/$procedures/verify/:domain": {
      $patch: {
        input: {
          param: {
            id: string | undefined;
            domain: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/organizations/:id/domains/internal": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
      $put: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          form: {
            domain: string | File;
          };
        };
        output: "";
        outputFormat: "text";
        status: 200;
      };
      $delete: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/organizations/:id/domains/internal/:domain": {
      $delete: {
        input: {
          param: {
            id: string | undefined;
            domain: string | undefined;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
      $patch: {
        input: {
          param: {
            id: string | undefined;
            domain: string | undefined;
          } & {
            id: string;
          };
          form: {
            is_verified?: string | File | undefined;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/organizations/:id/domains/external": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
      $put: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          form: {
            domain: string | File;
          };
        };
        output: "";
        outputFormat: "text";
        status: 200;
      };
      $delete: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: "";
        outputFormat: "text";
        status: 200;
      };
    };
    "/organizations/:id/domains/external/:domain": {
      $delete: {
        input: {
          param: {
            id: string | undefined;
            domain: string | undefined;
          } & {
            id: string;
          };
        };
        output: "";
        outputFormat: "text";
        status: 200;
      };
    };
    "/organizations/:id/members/:user_id/$procedures/join": {
      $post: {
        input: {
          form: {
            is_external: string | File;
          };
          param: {
            id: string | undefined;
            user_id: string | undefined;
          } & {
            user_id: string;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/organizations/:id/members/:user_id": {
      $post: {
        input: {
          form: {
            is_external: string | File;
          };
          param: {
            id: string | undefined;
            user_id: string | undefined;
          } & {
            user_id: string;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
      $patch: {
        input: {
          param: {
            id: string | undefined;
            user_id: string | undefined;
          } & {
            user_id: string;
          } & {
            id: string;
          };
          form: {
            is_external?: string | File | undefined;
            verification_type?: string | File | undefined;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
      $delete: {
        input: {
          param: {
            id: string | undefined;
            user_id: string | undefined;
          } & {
            user_id: string;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/organizations/:id/members": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          query: {
            describedby: string | string[];
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/organizations/:id": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/organizations/domains": {
      $get: {
        input: {
          query: {
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/organizations/leaders": {
      $get: {
        input: {
          query: {
            siret: string | string[];
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/organizations": {
      $get: {
        input: {
          query: {
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
            id?: string | string[] | undefined;
            "search-siret"?: string | string[] | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  } & {
    "/users/:id/moderations": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/users/:id/organizations": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          query: {
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/users/:id": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
      $delete: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/users/:id/reset": {
      $patch: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/users": {
      $get: {
        input: {
          query: {
            "search-email"?: string | string[] | undefined;
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
            id?: string | string[] | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  } & {
    "/moderations/:id/$procedures/validate": {
      $patch: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          form: {
            add_domain?: string | File | undefined;
            add_member?: string | File | undefined;
            send_notitfication?: string | File | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/moderations/:id/$procedures/reprocess": {
      $patch: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/moderations/:id/$procedures/rejected": {
      $patch: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          form: {
            message: string | File;
            subject: string | File;
          };
        };
        output: "OK";
        outputFormat: "text";
        status: 200;
      };
    };
    "/moderations/:id/$procedures/processed": {
      $patch: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/moderations/:id/duplicate_warning": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
          query: {
            organization_id: string | string[];
            user_id: string | string[];
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/moderations/:id/email": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/moderations/:id": {
      $get: {
        input: {
          param: {
            id: string | undefined;
          } & {
            id: string;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/moderations": {
      $get: {
        input: {};
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  } & {
    "/auth/login": {
      $post: {
        input: {};
        output: undefined;
        outputFormat: "redirect";
        status: 302;
      };
    };
    "/auth/fake/login/callback": {
      $get: {
        input: {};
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/auth/login/callback": {
      $get: {
        input: {
          query: {
            code: string | string[];
            state: string | string[];
          };
        };
        output: undefined;
        outputFormat: "redirect";
        status: 302;
      };
    };
    "/auth/logout": {
      $get: {
        input: {};
        output: undefined;
        outputFormat: "redirect";
        status: 302;
      };
    };
  } & {
    "/": {
      $get: {
        input: {};
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  } & {
    "/proxy/localhost:3000/*": {
      $get: {
        input: {};
        output: undefined;
        outputFormat: "redirect";
        status: 302;
      };
    };
  } & {
    "/readyz": {
      $get: {
        input: {};
        output: "readyz check passed";
        outputFormat: "text";
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/readyz/sentry": {
      $get: never;
    };
    "/readyz/zammad": {
      $get: {
        input: {};
        output: string;
        outputFormat: "text";
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    "/readyz/drizzle/moncomptepro": {
      $get: {
        input: {};
        output: string;
        outputFormat: "text";
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  } & {
    [
      x: `/assets/${string}/zammad/attachment/:ticket_id/:article_id/:attachment_id`
    ]: {
      $get: {
        input: {
          param: {
            article_id: string | undefined;
            attachment_id: string | undefined;
            ticket_id: string | undefined;
          };
        };
        output: {};
        outputFormat: string;
        status: import("hono/utils/http-status").StatusCode;
      };
    };
    [x: `/assets/${string}/bundle/config.js`]: {
      $get: {
        input: {};
        output: `export default ${string}`;
        outputFormat: "text";
        status: 200;
      };
    };
    [x: `/assets/${string}/bundle/env.js`]: {
      $get: {
        input: {};
        output: `export default ${string}`;
        outputFormat: "text";
        status: 200;
      };
    };
  } & {
    "/healthz": {
      $get: {
        input: {};
        output: "healthz check passed";
        outputFormat: "text";
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  } & {
    "/livez": {
      $get: {
        input: {};
        output: "livez check passed";
        outputFormat: "text";
        status: import("hono/utils/http-status").StatusCode;
      };
    };
  },
  "/"
>;
export type Router = typeof app;
export default app;
