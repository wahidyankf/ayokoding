import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'contents');

function getAllPostSlugs(): string[] {
  const slugs: string[] = [];

  function traverseDirectory(dir: string): void {
    // Skip directories with README.md
    if (fs.existsSync(path.join(dir, 'README.md'))) {
      return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverseDirectory(filePath);
      } else if (path.extname(file) === '.md' && file !== 'README.md') {
        const relativePath = path.relative(postsDirectory, filePath);
        const slug = relativePath.replace(/\.md$/, '');
        slugs.push(slug);
      }
    }
  }

  traverseDirectory(postsDirectory);
  return slugs;
}

function getCategories(): string[] {
  const slugs = getAllPostSlugs();
  const categories = [
    ...new Set(
      slugs.map((slug) =>
        slug.includes('/') ? slug.split('/')[0] : 'Uncategorized',
      ),
    ),
  ];
  return categories;
}

export async function getContentsByCategory(
  category: string,
): Promise<PostData[]> {
  const postsDirectory = path.join(process.cwd(), 'src', 'contents');
  const categoryPath = path.join(postsDirectory, category);

  // Check if the category directory exists
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  // Read the category directory
  const fileNames = fs.readdirSync(categoryPath);

  // Filter markdown files
  const markdownFiles = fileNames.filter(
    (fileName) => fileName.endsWith('.md') && fileName !== 'README.md',
  );

  // Get full data for each markdown file
  const posts: PostData[] = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const slug = `${category}/${fileName.replace(/\.md$/, '')}`;
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        description: matterResult.data.description || '',
        contentHtml: await markdownToHtml(matterResult.content || ''),
        tags: matterResult.data.tags || [],
        category: category,
      };
    }),
  );

  // Sort posts by date
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

function getPostData(slug: string): PostData {
  // Try the exact slug first
  let fullPath = path.join(postsDirectory, `${slug}.md`);

  // If the exact file doesn't exist, try finding it in nested directories
  if (!fs.existsSync(fullPath)) {
    // Traverse directories to find the markdown file
    function findMarkdownFile(dir: string): string | null {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          const nestedResult = findMarkdownFile(filePath);
          if (nestedResult) return nestedResult;
        } else if (path.extname(file) === '.md' && file !== 'README.md') {
          const relativePath = path.relative(postsDirectory, filePath);
          const fileSlug = relativePath.replace(/\.md$/, '');
          if (fileSlug === slug) return filePath;
        }
      }

      return null;
    }

    const foundPath = findMarkdownFile(postsDirectory);
    if (foundPath) {
      fullPath = foundPath;
    } else {
      // If README.md exists in the directory, use it
      const readmePath = path.join(postsDirectory, `${slug}/README.md`);
      if (fs.existsSync(readmePath)) {
        fullPath = readmePath;
      } else {
        throw new Error(`No markdown file found for slug: ${slug}`);
      }
    }
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = remark().use(html).processSync(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: data.title || '',
    date: data.date || '',
    description: data.description,
    tags: data.tags,
    category: data.category,
  };
}

function getAllContents(): PostData[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => getPostData(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function getRecentContents(limit: number = 5): Promise<PostData[]> {
  const allContents = getAllContents();
  const sortedContents = allContents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const recentContents = sortedContents.slice(0, limit);
  return Promise.all(recentContents.map((post) => getPostData(post.slug)));
}

export interface PostData {
  slug: string;
  contentHtml: string;
  title: string;
  date: string;
  formattedDate?: string;
  description?: string;
  tags?: string[];
  category?: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export {
  getAllPostSlugs,
  getCategories,
  getPostData,
  getRecentContents,
  markdownToHtml,
};
