// src/app/api/route.jsx

export let mockPosts = []; // Initialize mockPosts

function loadMockPosts() {
  if (typeof localStorage !== 'undefined') {
    const storedPosts = localStorage.getItem('mockPosts');
    if (storedPosts) {
      mockPosts = JSON.parse(storedPosts);
    }
  }
}

function saveMockPosts() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('mockPosts', JSON.stringify(mockPosts));
  }
}

// Handle GET requests to return posts
export async function GET() {
  loadMockPosts();
  return new Response(JSON.stringify(mockPosts), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

// Handle POST requests to add a new post
export async function POST(request) {
  const newPost = await request.json(); 
  newPost.id = mockPosts.length + 1; 
  mockPosts.push(newPost); 
  saveMockPosts(); 

  return new Response(JSON.stringify(mockPosts), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  });
}
