const apiKey = "615163727d45c8ad9b5cdff23f822884973cfa3130a7f1e138b351de563754f7";
const url = `http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?serviceKey=${apiKey}&Q0=${encodeURIComponent('경기도')}&Q1=${encodeURIComponent('이천시')}&pageNo=1&numOfRows=10&_type=json`;

console.log("Fetching NMC B552657 URL:", url);

fetch(url)
  .then(res => res.text())
  .then(text => {
    console.log("Response text start:", text.slice(0, 500));
    try {
      const json = JSON.parse(text);
      console.log("JSON response:", JSON.stringify(json, null, 2).slice(0, 1000));
    } catch (e) {
      console.log("Parsing failed:", e.message);
    }
  })
  .catch(err => console.error("Fetch error:", err));
