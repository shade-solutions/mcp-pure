import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), '../../docs/mcp');

export async function getMcpDoc(slug: string) {
  const fullPath = path.join(docsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as {
      title: string;
      description: string;
      icon: string;
      route: string;
    },
    content,
  };
}

export async function getAllMcpDocs() {
  const fileNames = fs.readdirSync(docsDirectory);
  const allDocs = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(docsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        frontmatter: data as {
          title: string;
          description: string;
          icon: string;
          route: string;
        },
      };
    });

  return allDocs;
}
