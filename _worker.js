export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Data Save karne ka logic
    if (url.pathname === "/api/submit" && request.method === "POST") {
      try {
        const data = await request.json();
        const id = `std_${Date.now()}`;
        // Yahan 'DATA' wahi hai jo aapne Settings > Bindings mein likha hai
        await env.DATA.put(id, JSON.stringify(data));
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
      }
    }

    // 2. Admin Data dekhne ka logic (No Password)
    if (url.pathname === "/api/responses") {
      try {
        const list = await env.DATA.list();
        const responses = await Promise.all(
          list.keys.map(async (k) => {
            const val = await env.DATA.get(k.name);
            return JSON.parse(val);
          })
        );
        return new Response(JSON.stringify({ success: true, responses }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
      }
    }

    // 3. Static files (index.html, etc.) load karne ke liye
    return env.ASSETS.fetch(request);
  }
};
