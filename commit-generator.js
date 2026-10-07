const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';
const git = simpleGit();

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const makeCommit = async (date) => {
    await jsonfile.writeFile(FILE_PATH, { date: date });
    await git.add([FILE_PATH]);
    await git.commit(date, { '--date': date });
    console.log('Commit created for:', date);
};

const startDate = moment('2025-08-18');
const endDate = moment('2026-10-06');

const commitDates = [];
let currentDate = startDate.clone();

while (currentDate.isSameOrBefore(endDate, 'day')) {
    const commitsToday = getRandomInt(1, 2);
    const commitTimes = [];

    for (let i = 0; i < commitsToday; i++) {
        const hour = getRandomInt(0, 23);
        const minute = getRandomInt(0, 59);
        commitTimes.push({ hour, minute });
    }

    commitTimes.sort((a, b) => {
        if (a.hour !== b.hour) return a.hour - b.hour;
        return a.minute - b.minute;
    });

    commitTimes.forEach(time => {
        commitDates.push(currentDate.clone()
            .hour(time.hour)
            .minute(time.minute)
            .format());
    });

    currentDate.add(1, 'day');
}

console.log(`Total commits to be created: ${commitDates.length}`);

(async () => {
    try {
        for (const date of commitDates) {
            await makeCommit(date);
        }
        console.log('Pushing to repository...');
        await git.push('origin', 'main', ['-u']);
        console.log('Successfully pushed all commits!');
    } catch (err) {
        console.log('Error:', err);
        process.exitCode = 1;
    }
})();
