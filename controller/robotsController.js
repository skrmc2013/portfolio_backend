const getRobotsTxt = (req, res) => {
    res.type('text/plain');
    res.send(`
      User-agent: *
      Disallow: /admin
      Allow: /
  
      Sitemap: https://skrmc.cloud/sitemap.xml
    `);
  };
  export default getRobotsTxt