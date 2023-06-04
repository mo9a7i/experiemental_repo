const fs = require("fs");
const colors = require("colors");
const simpleGit = require("simple-git");

const run = async () => {
    const git = simpleGit();
    await git.init();

    // Delete all previous commits and history
    await git.raw(["update-ref", "-d", "HEAD"]);
    await git.reset();

    const phrase = "Hi Mutlaq";
    const grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const startDate = new Date();
    const COMMITS_PER_DAY = 45;
    startDate.setDate(startDate.getDate() - 365 + 1);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 1) {
                const newDate = getDateFromDateAndOffset(startDate, i, j);
                git.env({ GIT_AUTHOR_DATE: newDate, GIT_COMMITTER_DATE: newDate });

                for (let doubleyou = 0; doubleyou < COMMITS_PER_DAY; doubleyou++) {
                    const content = grid[i][j] === 1 ? phrase + i + j + doubleyou : "";
                    fs.writeFileSync("README.md", content);
                    await git.add("README.md").then(() => git.commit(`Commit - ${content}`, null, { "--no-verify": null }))
                }


                process.stdout.write(`🟩`);

                //console.log(getDateFromDateAndOffset(startDate, i, j).green, i, j);
            } else {
                process.stdout.write(`🟥`);
            }
        }
        process.stdout.write(`\r\n`);
    }

    try {
        // Pull the latest changes from the remote repository
        //await git.pull("origin", "master", { "--allow-unrelated-histories": null });
    } catch (pullError) {
        if (pullError.message.includes("CONFLICT (add/add): Merge conflict in README.md")) {
            // Resolve merge conflict programmatically
            const resolvedContent = fs.readFileSync("README.md", "utf-8");
            fs.writeFileSync("README.md", resolvedContent);

            // Add the resolved file
            await git.add("README.md");

            // Commit the resolved changes
            await git.commit("Merge conflict resolution");

            // Continue the pull operation
            await git.pull("origin", "master", { "--allow-unrelated-histories": null });
        } else {
            throw pullError;
        }
    }

    // Push the changes to the remote repository
    //await git.push("origin", "master");
    console.log("Commits created and pushed successfully.");
};

function getDateFromDateAndOffset(date, row, column) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + column * 7 + row);
    return newDate.toISOString();
}

run();
