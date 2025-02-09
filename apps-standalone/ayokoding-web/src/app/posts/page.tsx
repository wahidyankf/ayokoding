import Link from 'next/link';
import { getAllPostSlugs, getPostData } from '../../lib/markdownUtils';

export default async function PostsList() {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(slugs.map(async (slug) => await getPostData(slug)));

  // Get unique categories
  const categories = [...new Set(slugs.map(slug => 
    slug.includes('/') ? slug.split('/')[0] : 'Uncategorized'
  ))];

  return (
    <div>
      <h1>Blog Posts</h1>
      
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link href={`/posts/${category}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </li>
        ))}
      </ul>

      <h2>All Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
