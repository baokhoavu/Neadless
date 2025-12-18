require('dotenv').config({ path: '.env.local' });

async function testQuery() {
  const query = `query { lessonCollection { items { slug title } } }`;
  const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testQuery();