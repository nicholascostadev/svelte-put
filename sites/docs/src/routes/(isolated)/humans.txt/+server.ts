import Mustache from 'mustache';

import { BUILD_TIMESTAMP } from '$env/static/private';
import { toW3CDate } from '$shared/utils/datetime';

import type { RequestHandler } from './$types';
import template from './humans.template.txt?raw';

export const GET: RequestHandler = async () => {
  const txt = Mustache.render(template, {
    last_update: toW3CDate(parseInt(BUILD_TIMESTAMP, 10)),
  });
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'text/plain',
  };
  return new Response(txt, { headers });
};
