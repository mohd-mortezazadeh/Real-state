import * as fs from 'fs'

import {GetServerSideProps} from "next";
import {getAllProperty} from "../services/api/property";

const Sitemap = () => {
    return null
}

export const getServerSideProps : GetServerSideProps = async ({ res }) => {
    const BASE_URL = 'https://villaarzan.com';

    const staticPaths = fs
        .readdirSync("src/pages")
        .filter((staticPage) => {
            return ![
                "api",
                "_app.js",
                "_document.js",
                "404.js",
                "sitemap.xml.js",
            ].includes(staticPage);
        })
        .map((staticPagePath) => {
            return `${BASE_URL}/${staticPagePath}`;
        });

    const properties = await getAllProperty()

    const dynamicPaths = properties.posts.map( (singleProperty : any) => {

        return `${BASE_URL}/single-property/${singleProperty.id}`

    })

    const allPaths =[ ...staticPaths , ...dynamicPaths ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((url) => {
            return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};


export default Sitemap