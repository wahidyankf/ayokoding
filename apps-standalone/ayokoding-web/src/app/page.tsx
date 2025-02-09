import Navigation from '../components/Navigation';
import Link from 'next/link';
import { getRecentPosts } from '../lib/markdownUtils';

export default function Home() {
  const recentPosts = getRecentPosts().map(post => ({
    ...post,
    formattedDate: new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }));

  return (
    <div>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <article key={post.slug} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">
                  <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-2">Published on: {post.formattedDate}</p>
                <Link 
                  href={`/posts/${post.slug}`} 
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
