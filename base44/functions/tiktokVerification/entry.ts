Deno.serve(async (req) => {
  return new Response(
    "tiktok-developers-site-verification=FwcnkvlASqndwm19K5fOKyp8ID6tTc14",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'inline; filename="tiktokFwcnkvlASqndwm19K5fOKyp8ID6tTc14.txt"',
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
});