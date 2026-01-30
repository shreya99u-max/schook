    // 2. View Data (Bina Password ke)
    if (url.pathname === "/api/responses" && request.method === "POST") {
      // Password wala check yahan se hata diya gaya hai
      const list = await env.DATA.list();
      const responses = await Promise.all(
        list.keys.map(async (k) => JSON.parse(await env.DATA.get(k.name)))
      );
      return new Response(JSON.stringify({ success: true, responses }));
    }

