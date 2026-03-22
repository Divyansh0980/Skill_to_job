import { getViewerProfile, getRepositoryDetails } from './lib/github.service';

// Basic script to test the generic GraphQL service
async function testGitHubService() {
  console.log('Testing GitHub Service...');

  try {
    // Attempt to fetch the Vercel Next.js repository details
    console.log('\n1. Fetching repository details (vercel/next.js)...');
    const repo = await getRepositoryDetails('vercel', 'next.js');
    console.log('Success! Repository Details:');
    console.log(`- Name: ${repo.repository.name}`);
    console.log(`- Stars: ${repo.repository.stargazerCount}`);
    console.log(`- URL: ${repo.repository.url}`);

    // Attempt to fetch the authenticated user profile
    console.log('\n2. Fetching your viewer profile...');
    const user = await getViewerProfile();
    console.log('Success! Connected as:');
    console.log(`- Login: ${user.viewer.login}`);
    console.log(`- Name: ${user.viewer.name}`);

  } catch (error: any) {
    console.error('\n❌ Test Failed as Expected (or you encountered a network error):');
    console.error(error.message);
    if (!process.env.GITHUB_ACCESS_TOKEN) {
      console.log('\n💡 Tip: You need to add GITHUB_ACCESS_TOKEN to your .env file to see real data.');
    }
  }
}

testGitHubService();
