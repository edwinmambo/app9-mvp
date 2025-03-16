import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create featured content
  const featuredContent = [
    {
      title: 'Getting Started with Machine Learning',
      description:
        'A beginner-friendly guide to understanding machine learning concepts and applications.',
      content:
        'Machine learning is a field of artificial intelligence that focuses on building systems that learn from data...',
      tags: ['machine learning', 'AI', 'data science', 'beginner'],
      featured: true,
      type: 'Article',
    },
    {
      title: 'Web Development Best Practices 2023',
      description:
        'Learn the latest best practices for modern web development.',
      content:
        'The web development landscape continues to evolve rapidly. In this guide, we explore the most important practices...',
      tags: ['web development', 'javascript', 'frontend', 'backend'],
      featured: true,
      type: 'Guide',
    },
    {
      title: 'Introduction to Blockchain Technology',
      description:
        'Understand the fundamentals of blockchain and its potential applications.',
      content:
        'Blockchain is a distributed ledger technology that enables secure, transparent, and tamper-proof record-keeping...',
      tags: ['blockchain', 'cryptocurrency', 'technology'],
      featured: true,
      type: 'Tutorial',
    },
    {
      title: 'The Future of Artificial Intelligence',
      description:
        'Exploring the potential impact of AI on society and various industries.',
      content:
        'Artificial intelligence is rapidly transforming how we live and work. This article examines the future implications...',
      tags: ['AI', 'future tech', 'innovation'],
      featured: true,
      type: 'Research',
    },
    {
      title: 'Cybersecurity Essentials for Everyone',
      description:
        'Simple but effective cybersecurity practices to keep your digital life safe.',
      content:
        'In an increasingly connected world, cybersecurity has become essential for everyone. This guide covers the basics...',
      tags: ['cybersecurity', 'privacy', 'digital safety'],
      featured: true,
      type: 'Guide',
    },
  ];

  // Create regular content with diverse types and tags
  const regularContent = [
    {
      title: 'Python for Data Science',
      description:
        'Learn how to use Python for data analysis and visualization.',
      content:
        'Python has become the language of choice for data scientists due to its simplicity and powerful libraries...',
      tags: ['python', 'data science', 'programming', 'beginner'],
      featured: false,
      type: 'Course',
    },
    {
      title: 'Advanced React Patterns',
      description:
        'Master advanced React patterns and techniques for building scalable applications.',
      content:
        'This guide covers advanced React patterns including render props, compound components, and hooks...',
      tags: ['react', 'javascript', 'frontend', 'advanced'],
      featured: false,
      type: 'Tutorial',
    },
    {
      title: 'Introduction to DevOps',
      description: 'Learn the fundamentals of DevOps practices and tools.',
      content:
        'DevOps is a set of practices that combines software development and IT operations to shorten the development lifecycle...',
      tags: ['devops', 'CI/CD', 'automation', 'intermediate'],
      featured: false,
      type: 'Guide',
    },
    {
      title: 'Mobile App Development with Flutter',
      description: 'Build cross-platform mobile apps with Flutter framework.',
      content:
        "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop...",
      tags: ['flutter', 'mobile', 'dart', 'cross-platform'],
      featured: false,
      type: 'Course',
    },
    {
      title: 'Cloud Computing Fundamentals',
      description: 'Understanding cloud computing concepts and services.',
      content:
        'Cloud computing provides on-demand access to computing resources including servers, storage, databases, and more...',
      tags: ['cloud', 'aws', 'azure', 'infrastructure'],
      featured: false,
      type: 'Article',
    },
    {
      title: 'Ethical Hacking Basics',
      description:
        'Learn the fundamentals of ethical hacking and penetration testing.',
      content:
        'Ethical hacking involves identifying weaknesses in computer systems and networks to improve security...',
      tags: ['security', 'hacking', 'penetration testing', 'cybersecurity'],
      featured: false,
      type: 'Course',
    },
    {
      title: 'Data Visualization with D3.js',
      description:
        'Create interactive data visualizations for the web using D3.js.',
      content:
        'D3.js is a JavaScript library for producing dynamic, interactive data visualizations in web browsers...',
      tags: ['data visualization', 'javascript', 'd3.js', 'frontend'],
      featured: false,
      type: 'Tutorial',
    },
    {
      title: 'Microservices Architecture',
      description:
        'Understanding microservices architecture and implementation strategies.',
      content:
        'Microservices architecture is an approach to building applications as a collection of small, independent services...',
      tags: ['microservices', 'architecture', 'backend', 'advanced'],
      featured: false,
      type: 'Article',
    },
    {
      title: 'Machine Learning for Natural Language Processing',
      description:
        'Apply machine learning techniques to process and analyze text data.',
      content:
        'Natural Language Processing (NLP) is a field at the intersection of computer science, artificial intelligence, and linguistics...',
      tags: ['NLP', 'machine learning', 'AI', 'text processing'],
      featured: false,
      type: 'Research',
    },
    {
      title: 'Responsive Web Design Principles',
      description:
        'Learn how to create websites that work on any device and screen size.',
      content:
        'Responsive web design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes...',
      tags: ['web design', 'css', 'html', 'frontend'],
      featured: false,
      type: 'Guide',
    },
  ];

  // Combine all content
  const allContent = [...featuredContent, ...regularContent];

  for (const content of allContent) {
    // Instead of using upsert with title as the unique identifier,
    // we'll check if content with this title exists and create it if not
    const existingContent = await prisma.content.findFirst({
      where: { title: content.title },
    });

    if (!existingContent) {
      await prisma.content.create({
        data: content,
      });
    }
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
