import { NextApiRequest, NextApiResponse } from 'next';

export const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const publicUrlHost = process.env.VERCEL_ENV_URL
    ? `https://${process.env.VERCEL_ENV_URL}`
    : process.env.PUBLIC_URL;

  const { secret, path } = req.query;

  if (secret == null) {
    return res.status(400).send('secret is required');
  }

  if (path == null) {
    return res.status(400).send('path is required');
  }

  // Check for secret token
  if (secret !== process.env.JSS_REVALIDATE_SECRET) {
    return res.status(400).send('Invalid secret');
  }

  try {
    // this should be the actual path not a rewritten path

    const pagePath = path.toString();
    await res.revalidate(pagePath);

    const pageUrl = publicUrlHost + pagePath;

    return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cache Clear</title>
    </head>
    <body>
      <h4>Cache cleared for: <a href="${pageUrl}">${pageUrl}</a></h4>
    </body>
    </html>
  `);
  } catch (err) {
    // If there was an error, Next.js will continue to show the last successfully generated page
    return res.status(500).send('Error revalidating:' + err);
  }
};

export default handler;
