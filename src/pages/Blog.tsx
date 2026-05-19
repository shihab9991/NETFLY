import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, ChevronLeft } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get('/api/blogs')
      .then(res => {
        setBlogs(res.data);
        setLoading(false);
      });
  }, []);

  if (id) {
    const blog = blogs.find(b => b.id === id);
    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!blog) return <div className="text-center py-20 text-gray-500">Blog post not found.</div>;

    return (
      <div className="bg-white min-h-screen pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> BACK TO JOURNAL
          </Link>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-4">
            {blog.category || 'Article'}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6 leading-tight">{blog.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-12">
            <span>By {blog.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
           <img src={blog.image} alt={blog.title} className="w-full h-auto max-h-[600px] object-cover" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-gray-600">
            {blog.content.split('\n').map((paragraph: string, i: number) => (
              <p key={i} className="mb-6 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-100 py-16 text-center">
        <h1 className="text-4xl font-serif font-bold text-black mb-4">Journal</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Latest style news, fashion tips, and styling guides from our experts.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {loading ? (
          <div className="text-center text-gray-500">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No blog posts available.</div>
            ) : blogs.map(blog => (
              <article key={blog.id} className="group">
                <Link to={`/blog/${blog.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 mb-6">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {blog.category || 'Article'}
                  </div>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <Link to={`/blog/${blog.id}`}>
                  <h3 className="text-xl font-serif font-bold text-black mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.content}
                </p>
                <Link to={`/blog/${blog.id}`} className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
                  READ MORE <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
