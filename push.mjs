import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.js';

const dir = process.cwd();

async function main() {
    console.log("Initializing git...");
    await git.init({ fs, dir, defaultBranch: 'main' });

    console.log("Adding remote...");
    await git.addRemote({
        fs,
        dir,
        remote: 'origin',
        url: 'https://github.com/Noni-creator/noni-social.git'
    });

    console.log("Staging files...");
    const matrix = await git.statusMatrix({ fs, dir });
    for (const row of matrix) {
        const filepath = row[0];
        // add if modified or untracked
        await git.add({ fs, dir, filepath });
    }

    console.log("Committing files...");
    await git.commit({
        fs,
        dir,
        author: {
            name: 'Noni Bot',
            email: 'bot@noni.social',
        },
        message: 'Phase 1: Project init and technical specs'
    });

    console.log("Pushing to main branch...");
    await git.push({
        fs,
        http,
        dir,
        remote: 'origin',
        ref: 'main',
        force: true,
        onAuth: () => ({ username: process.env.GITHUB_TOKEN })
    });

    console.log("Push complete!");
}

main().catch(console.error);
