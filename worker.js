export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Submit Data
    if (url.pathname === "/api/submit" && request.method === "POST") {
      const data = await request.json();
      const id = `std_${Date.now()}`;
      await env.DATA.put(id, JSON.stringify(data));
      return new Response(JSON.stringify({ success: true }));
    }

    // 2. View Data (Admin Only)
    if (url.pathname === "/api/responses" && request.method === "POST") {
      const { password } = await request.json();
      if (password !== "MY_ADMIN_123") return new Response(JSON.stringify({ success: false }));
      
      const list = await env.DATA.list();
      const responses = await Promise.all(
        list.keys.map(async (k) => JSON.parse(await env.DATA.get(k.name)))
      );
      return new Response(JSON.stringify({ success: true, responses }));
    }

    return env.ASSETS.fetch(request);
  }
};

