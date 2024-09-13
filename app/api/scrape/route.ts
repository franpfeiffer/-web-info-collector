import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    
    const getVisibleText = (element: cheerio.Cheerio) => {
      return element.clone().children().remove().end().text().trim();
    };

    const news = $('article, .news-item, .post, div:has(> h2, > h3)')
      .map((_, element) => {
        const $element = $(element);
        const title = $element.find('h1, h2, h3, .title').first().text().trim();
        const excerpt = getVisibleText($element.find('p').first()) || 
                        getVisibleText($element) ||
                        $element.text().trim().slice(0, 150) + '...';
        const link = $element.find('a').first().attr('href');

        if (title && excerpt) {
          return { title, excerpt, link };
        }
      }).get().filter(Boolean).slice(0, 3);

    const siteDescription = news.length === 0 ? 
      $('p').slice(0, 3).map((_, el) => $(el).text().trim()).get().join(' ') || 
      'No se pudo extraer una descripción detallada del sitio.' :
      '';

    return NextResponse.json({ 
      url,
      title,
      description,
      news,
      siteDescription,
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to fetch website data' }, { status: 500 });
  }
}
