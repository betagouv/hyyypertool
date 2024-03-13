/// <reference types="node" />
/// <reference types="bun-types" />
declare const app: import("hono/hono-base").HonoBase<
  import("hono").Env,
  import("hono/types").MergeSchemaPath<
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono/types").MergeSchemaPath<
          import("hono").ToSchema<
            "patch",
            "/:domain",
            {
              param: {
                id: string;
                domain: string;
              };
            },
            {}
          >,
          "/verify"
        >,
        "/$procedures"
      > &
        import("hono/types").MergeSchemaPath<
          import("hono/types").MergeSchemaPath<
            import("hono").ToSchema<
              "get",
              "/",
              {
                param: {
                  id: string;
                };
              },
              {}
            > &
              import("hono").ToSchema<
                "put",
                "/",
                {
                  param: {
                    id: string;
                  };
                } & {
                  form: {
                    domain: string | File;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "delete",
                "/:domain",
                {
                  param: {
                    id: string;
                    domain: string;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "delete",
                "/",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "patch",
                "/:domain",
                {
                  param: {
                    id: string;
                    domain: string;
                  };
                } & {
                  form: {
                    is_verified?: string | File | undefined;
                  };
                },
                {}
              >,
            "/internal"
          > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "get",
                "/",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              > &
                import("hono").ToSchema<
                  "put",
                  "/",
                  {
                    param: {
                      id: string;
                    };
                  } & {
                    form: {
                      domain: string | File;
                    };
                  },
                  {}
                > &
                import("hono").ToSchema<
                  "delete",
                  "/",
                  {
                    param: {
                      id: string;
                    };
                  },
                  {}
                > &
                import("hono").ToSchema<
                  "delete",
                  "/:domain",
                  {
                    param: {
                      id: string;
                      domain: string;
                    };
                  },
                  {}
                >,
              "/external"
            >,
          "/domains"
        > &
        import("hono/types").MergeSchemaPath<
          import("hono/types").MergeSchemaPath<
            import("hono/types").MergeSchemaPath<
              import("hono/types").MergeSchemaPath<
                import("hono").ToSchema<
                  "post",
                  "/",
                  {
                    form: {
                      is_external: string | File;
                    };
                  } & {
                    param: {
                      id: string;
                      user_id: string;
                    };
                  },
                  {}
                >,
                "/join"
              >,
              "/$procedures"
            > &
              import("hono").ToSchema<
                "post",
                "/",
                {
                  form: {
                    is_external: string | File;
                  };
                } & {
                  param: {
                    id: string;
                    user_id: string;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "patch",
                "/",
                {
                  param: {
                    id: string;
                    user_id: string;
                  };
                } & {
                  form: {
                    verification_type?: string | File | undefined;
                    is_external?: string | File | undefined;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "delete",
                "/",
                {
                  param: {
                    id: string;
                    user_id: string;
                  };
                },
                {}
              >,
            "/:user_id"
          > &
            import("hono").ToSchema<
              "get",
              "/",
              {
                param: {
                  id: string;
                };
              } & {
                query: {
                  page?: string | string[] | undefined;
                  page_size?: string | string[] | undefined;
                };
              },
              {}
            >,
          "/members"
        > &
        import("hono").ToSchema<
          "get",
          "/",
          {
            param: {
              id: string;
            };
          },
          {}
        >,
      "/:id"
    > &
      import("hono/types").MergeSchemaPath<
        import("hono").ToSchema<
          "get",
          "/",
          {
            query: {
              siret: string | string[];
            };
          },
          {}
        >,
        "/leaders"
      > &
      import("hono").ToSchema<
        "get",
        "/",
        {
          query: {
            "search-siret"?: string | string[] | undefined;
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
            id?: string | string[] | undefined;
          };
        },
        {}
      >,
    "/organizations"
  > &
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono/types").MergeSchemaPath<
          import("hono").ToSchema<
            "get",
            "/",
            {
              param: {
                id: string;
              };
            },
            {}
          >,
          "/moderations"
        > &
          import("hono/types").MergeSchemaPath<
            import("hono").ToSchema<
              "get",
              "/",
              {
                param: {
                  id: string;
                };
              } & {
                query: {
                  page?: string | string[] | undefined;
                  page_size?: string | string[] | undefined;
                };
              },
              {}
            >,
            "/organizations"
          > &
          import("hono").ToSchema<
            "get",
            "/",
            {
              param: {
                id: string;
              };
            },
            {}
          > &
          import("hono").ToSchema<
            "delete",
            "/",
            {
              param: {
                id: string;
              };
            },
            {}
          > &
          import("hono").ToSchema<
            "patch",
            "/reset",
            {
              param: {
                id: string;
              };
            },
            {}
          >,
        "/:id"
      > &
        import("hono").ToSchema<
          "get",
          "/",
          {
            query: {
              "search-email"?: string | string[] | undefined;
              page?: string | string[] | undefined;
              page_size?: string | string[] | undefined;
              id?: string | string[] | undefined;
            };
          },
          {}
        >,
      "/users"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono/types").MergeSchemaPath<
          import("hono/types").MergeSchemaPath<
            import("hono").ToSchema<
              "patch",
              "/",
              {
                param: {
                  id: string;
                };
              },
              {}
            >,
            "/reprocess"
          > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "patch",
                "/",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              >,
              "/rejected"
            > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "patch",
                "/",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              >,
              "/processed"
            >,
          "/$procedures"
        > &
          import("hono/types").MergeSchemaPath<
            import("hono").ToSchema<
              "get",
              "/",
              {
                query: {
                  organization_id: string | string[];
                  user_id: string | string[];
                };
              },
              {}
            >,
            "/duplicate_warning"
          > &
          import("hono/types").MergeSchemaPath<
            import("hono").ToSchema<
              "get",
              "/",
              {
                param: {
                  id: string;
                };
              },
              {}
            > &
              import("hono").ToSchema<
                "put",
                "/",
                {
                  param: {
                    id: string;
                  };
                } & {
                  form: {
                    response: string | File;
                    "mail-subject": string | File;
                  };
                },
                {}
              >,
            "/email"
          > &
          import("hono").ToSchema<
            "get",
            "/",
            {
              param: {
                id: string;
              };
            },
            {}
          >,
        "/:id"
      > &
        import("hono").ToSchema<"get", "/", unknown, {}>,
      "/moderations"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"post", "/login", unknown, {}> &
        import("hono").ToSchema<"get", "/fake/login/callback", unknown, {}> &
        import("hono").ToSchema<
          "get",
          "/login/callback",
          {
            query: {
              code: string | string[];
              state: string | string[];
            };
          },
          {}
        > &
        import("hono").ToSchema<"get", "/logout", unknown, {}>,
      "/auth"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"get", "/", unknown, {}>,
      "/"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"get", "/localhost:3000/*", unknown, {}>,
      "/proxy"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"get", "/", unknown, {}> &
        import("hono").ToSchema<"get", "/zammad", unknown, {}> &
        import("hono").ToSchema<"get", "/drizzle/moncomptepro", unknown, {}>,
      "/readyz"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono").ToSchema<
          "get",
          "/attachment/:ticket_id/:article_id/:attachment_id",
          {
            param: {
              ticket_id: string;
              article_id: string;
              attachment_id: string;
            };
          },
          {}
        >,
        "/zammad"
      > &
        import("hono").ToSchema<"get", "/bundle/config.js", unknown, {}> &
        import("hono").ToSchema<"get", "/bundle/env.js", unknown, {}> &
        import("hono").ToSchema<"get", "/bundle/lit.js", unknown, {}> &
        import("hono").ToSchema<
          "get",
          "/bundle/lit/:filename{.+\\.js$}",
          unknown,
          {}
        >,
      `/assets/${string}`
    > &
    import("hono").ToSchema<"get", "/healthz", unknown, {}> &
    import("hono").ToSchema<"get", "/livez", unknown, {}>,
  "/"
>;
export type Router = typeof app;
export default app;
