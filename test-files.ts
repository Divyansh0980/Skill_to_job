import { getTopContributedFiles } from './lib/github.service';

async function testFiles() {
  console.log('Testing GitHub Analytics: Top Contributed Files...\n');

  if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.error('❌ GITHUB_ACCESS_TOKEN is missing!');
    console.error('Please run this script with your token attached:');
    console.error('GITHUB_ACCESS_TOKEN=your_token npx tsx test-files.ts');
    return;
  }

  try {
    const username = 'shuding';
    const owner = 'vercel';
    const repo = 'next.js';
    const numCommits = 10;

    console.log(`Analyzing the last ${numCommits} commits by ${username} in ${owner}/${repo}...`);
    console.time('Analysis Time');
    
    const topFiles = await getTopContributedFiles(username, owner, repo, numCommits);
    
    console.timeEnd('Analysis Time');

    console.log(`\nTop ${topFiles.length} distinct files touched by ${username} across those ${numCommits} commits:`);
    
    if (topFiles.length === 0) {
      console.log('No files found (perhaps the user has 0 commits in this repository).');
    } else {
      topFiles.forEach((file, index) => {
        console.log(` ${index + 1}. [Touched in ${file.commitsTouched} commits] -> ${file.path}`);
      });
    }

    console.log('\n✅ File contribution analytics test completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Test execution failed:');
    console.error(error.message);
  }
}

testFiles();
