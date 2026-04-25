const url = "https://vagttrkoefdymqvipzlz.supabase.co/rest/v1/cart";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZ3R0cmtvZWZkeW1xdmlwemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjY2OTgsImV4cCI6MjA4OTc0MjY5OH0.Al8xgc0PEXHn5bHlEtTAIAeisFpC1YHdGEDd_Km0BlQ";

async function testSupabase() {
  console.log("1. Testing GET /cart...");
  try {
    const res = await fetch(`${url}?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const text = await res.text();
    console.log("GET Status:", res.status);
    console.log("GET Body:", text);
    
    console.log("\n2. Testing POST /cart (insert dummy item)...");
    const postRes = await fetch(url, {
      method: "POST",
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: 1234567,
        product_id: "test",
        quantity: 1
      })
    });
    const postText = await postRes.text();
    console.log("POST Status:", postRes.status);
    console.log("POST Body:", postText);
  } catch(e) {
    console.error("Fetch Error:", e);
  }
}

testSupabase();
