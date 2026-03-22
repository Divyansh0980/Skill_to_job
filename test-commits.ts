import { getUserPublicRepositories, getRepositoryCommitsByAuthor } from './lib/github.service';

async function runTest() {
  console.log('Testing GitHub Service: Author Commits & Public Repos...\n');

  try {
    console.log('1. Fetching top 3 recent public repositories for "vercel"...');
    const reposData = await getUserPublicRepositories('vercel', 3);
    
    if (!reposData.userExists) {
      console.log('User vercel not found!');
    } else {
      console.log(`Found ${reposData.repositories.length} repos. Most recent:`);
      reposData.repositories.forEach(repo => {
        console.log(` - ${repo.name} (${repo.stargazerCount}⭐️) [Updated: ${repo.updatedAt}]`);
      });
    }

    console.log('\n2. Fetching top 3 recent commits exclusively by "shuding" in "vercel/next.js"...');
    const commitsData = await getRepositoryCommitsByAuthor('shuding', 'vercel', 'next.js', 3);
    
    if (!commitsData.repositoryExists) {
      console.log('Repository vercel/next.js not found!');
    } else {
      console.log(`Found ${commitsData.commits.length} commits. Latest:`);
      commitsData.commits.forEach(commit => {
        console.log(` - [${commit.committedDate.split('T')[0]}] ${commit.message.split('\n')[0]} (${commit.changedFilesIfAvailable || 0} files changed)`);
      });
    }

    console.log('\n✅ Test completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Test Failed:');
    console.error(error.message);
    if (!process.env.GITHUB_ACCESS_TOKEN) {
      console.log('\n💡 Tip: Next.js reads your .env file in the browser, but standalone node scripts like this one require you to pass the token explicitly if it missing:');
      console.log('Run: GITHUB_ACCESS_TOKEN=your_token npx tsx test-commits.ts');
    }
  }
}

runTest();
