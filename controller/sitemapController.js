import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { BlogPost } from '../models/BlogPostSchema.js';
import { Project } from '../models/projectSchema.js';

const generateSitemap = async (req, res) => {
  try {
    // Correct hostname for your website
    const smStream = new SitemapStream({ hostname: 'https://skrmc.cloud/' });
    const pipeline = smStream.pipe(createGzip());

    // Fetch all blog posts from the database and add them to the sitemap
    const blogs = await BlogPost.find().select('slug');
    blogs.forEach(blog => {
      smStream.write({ url: `/blog/${blog.slug}`, changefreq: 'daily', priority: 0.8 });
    });

    // Fetch all projects from the database and add them to the sitemap
    const projects = await Project.find().select('slug');
    projects.forEach(project => {
      smStream.write({ url: `/project/${project.slug}`, changefreq: 'daily', priority: 0.7 });
    });

    // Add the homepage to the sitemap
    smStream.write({ url: `/`, changefreq: 'daily', priority: 1.0 });

    // Add static pages like services and about
    smStream.write({ url: `/services`, changefreq: 'daily', priority: 0.7 });
    smStream.write({ url: `/about`, changefreq: 'daily', priority: 0.7 });

    smStream.end();

    // Stream the generated sitemap to the response
    const sitemap = await streamToPromise(pipeline);
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end();
  }
};

export default generateSitemap;
