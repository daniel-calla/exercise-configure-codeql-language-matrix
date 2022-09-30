/*
For this example we are using the folling tools:
to use core toolkit run:  npm install @actions/core
to use github toolkit run: npm install @actions/github
to allow compile the whole solution (avoiding upload node_modules) run: use npm i -g @vercel/ncc
to compile run:  npx ncc build .\.github\actions\open_issue\index.js -o .\.github\actions\open_issue\dist
we are using octokit as a tool for fetching an issue https://octokit.github.io/rest.js/v18
*/

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        //throw (new Error("Failed"));

        // enable debugging and other logs
        core.debug("Debug mode");
        //core.warning("Warning mode");
        //core.error("Error mode");


        const token = core.getInput('token');
        const title = core.getInput('title');
        const body = core.getInput('body');
        const assignee = core.getInput('assignee');

        const octokit = new github.GitHub(token);
        const response = await octokit.issues.create({
            ...github.context.repo,
            title,
            body,
            assignee: assignee ? assignee : undefined

        })


        // do not show sensitive data
        core.setSecret(token);
        console.log(`Showing the token here:  ${token}`)

        const time = new Date();
        console.log(`Showing date time here:  ${time.toTimeString()}`)

        core.startGroup('Logging github object');
        console.log(JSON.stringify(github, null, '\t'));
        core.endGroup();

        //core.exportVariable('issue', JSON.stringify(response.data));
        core.setOutput('issue', JSON.stringify(response.data));

    } catch (error) {
        core.setFailed(`There was an error: ${error.message}`);
    }
}

run();

