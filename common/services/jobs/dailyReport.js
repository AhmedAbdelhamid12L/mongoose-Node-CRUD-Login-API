var cron = require('node-cron');
const reportTemplate = require('../../Templates/reportTemplate');
const sendEmail = require('../sendEmail');

const dailyReport = ()=> {
    // cron.schedule('19 02 * * *', async () => {
    //     console.log('running a task every day');
    //     const info = await sendEmail(
    //         ['ahmedabdelhamid121296@gmail.com'],
    //         "Daily Report",
    //         reportTemplate()
    //       );
    //   });
}

module.exports = dailyReport;