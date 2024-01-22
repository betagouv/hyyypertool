//

import env from ":common/env";
import { HTTPError } from ":common/errors";

//

const CLOSED_STATE_ID = "4";
const EMAIL_TYPE_ID = 1;
const GROUP_MONCOMPTEPRO = "MonComptePro";
export const GROUP_MONCOMPTEPRO_SENDER_ID = 1;
const NORMAL_PRIORITY_ID = "1";

//

export async function get_zammad_mail({ ticket_id }: { ticket_id: number }) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/ticket_articles/by_ticket/${ticket_id}`,
    method: "GET",
    searchParams: {
      page: String(1),
      per_page: String(1),
      sort_by: "created_at",
      order_by: "desc",
    },
  });

  return response.json() as Promise<Zammad_Article[]>;
}
export async function get_zammad_attachment({
  article_id,
  attachment_id,
  ticket_id,
}: {
  article_id: number;
  attachment_id: number;
  ticket_id: number;
}) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/ticket_attachment/${ticket_id}/${article_id}/${attachment_id}`,
    method: "GET",
    searchParams: {},
  });

  return response;
}

export async function send_zammad_mail({
  body,
  state,
  subject,
  ticket_id,
}: {
  subject: string;
  body: string;
  ticket_id: number;
  state: UpdateTicket["state"];
}) {
  const response = await fetch_zammad_api({
    body: {
      state,
      article: {
        subject,
        body,
        content_type: "text/html",
      },
    },
    endpoint: `/api/v1/tickets/${ticket_id}`,
    method: "PUT",
    searchParams: {},
  });

  const ticket: Ticket = await response.json();

  return ticket;
}

//

interface CreateArticle {
  body: string;
  content_type: "text/html";
  internal: false;
  origin_by_id: string;
  sender: string;
  subject: string;
  ticket_id: number;
  time_unit: "15";
  type: "email";
}
interface Ticket {
  id: number;
  title: string;
  article_ids: number[];
}
interface UpdateTicket {
  state: "closed" | "open";
  article: {
    subject: string;
    body: string;
    from?: string;
    internal?: boolean;
    content_type: "text/html";
  };
}

export interface Zammad_Article {
  body: string;
  created_at: string;
  created_by: string;
  id: number;
  from: string;
  sender_id: number;
  subject: string;
}

interface Zammad_Pagination {
  per_page: string;
  page: string;
}

interface Zammad_Order {
  sort_by: string;
  order_by: "asc" | "desc";
}

type Options =
  | {
      endpoint: `/api/v1/tickets/${number}`;
      method: "PUT";
      body: UpdateTicket;
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/ticket_articles/by_ticket/${number}`;
      method: "GET";
      searchParams: Partial<Zammad_Pagination & Zammad_Order>;
    }
  | {
      endpoint: `/api/v1/ticket_attachment/${number}/${number}/${number}`;
      method: "GET";
      searchParams: {};
    };

async function fetch_zammad_api(options: Options) {
  const searchParams = new URLSearchParams(options.searchParams);
  const url = `${env.ZAMMAD_URL}${options.endpoint}?${searchParams.toString()}`;
  const headers = new Headers({
    "content-type": "application/json",
    Authorization: `Bearer ${env.ZAMMAD_TOKEN}`,
  });

  // if (env.DO_NOT_SEND_MAIL) {
  //   console.info(`Send mail not send to ${ticket_id}:`);
  //   console.info(data);
  //   return { id: null } as Ticket;
  // }
  console.debug(`fetch_zammad_api: ${url}`);
  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.method === "GET" ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new HTTPError(`${url} ${response.status} ${response.statusText}`);
  }

  return response;
}