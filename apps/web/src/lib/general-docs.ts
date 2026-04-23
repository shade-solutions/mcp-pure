import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), '../../docs');

export async function getDoc(slug: string) {
  const fullPath = path.join(docsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Doc not found: ${slug}`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
  };
}

export async function getAllDocs() {
  const fileNames = fs.readdirSync(docsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}
