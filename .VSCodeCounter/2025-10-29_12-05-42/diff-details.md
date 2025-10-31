# Diff Details

Date : 2025-10-29 12:05:42

Directory /home/jadhu/projects/Demo_Project/bhutanchoice.com/client

Total : 66 files,  -11902 codes, -337 comments, -1947 blanks, all -14186 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [agent/.env](/agent/.env) | Properties | -4 | 0 | 0 | -4 |
| [agent/app.js](/agent/app.js) | JavaScript | -44 | -6 | -13 | -63 |
| [agent/config/connection.js](/agent/config/connection.js) | JavaScript | -17 | 0 | -4 | -21 |
| [agent/helper/agentAuthHelper.js](/agent/helper/agentAuthHelper.js) | JavaScript | -58 | -5 | -16 | -79 |
| [agent/helper/agentHelper.js](/agent/helper/agentHelper.js) | JavaScript | -265 | -18 | -47 | -330 |
| [agent/helper/bookingHelper copy.js](/agent/helper/bookingHelper%20copy.js) | JavaScript | -14 | 0 | -6 | -20 |
| [agent/helper/bookingHelper.js](/agent/helper/bookingHelper.js) | JavaScript | -421 | -155 | -89 | -665 |
| [agent/helper/indexHelper.js](/agent/helper/indexHelper.js) | JavaScript | -930 | -81 | -116 | -1,127 |
| [agent/helper/settingHelper.js](/agent/helper/settingHelper.js) | JavaScript | -118 | -3 | -20 | -141 |
| [agent/helper/startingHelper.js](/agent/helper/startingHelper.js) | JavaScript | -741 | -589 | -4 | -1,334 |
| [agent/helper/verifyAgent.js](/agent/helper/verifyAgent.js) | JavaScript | -26 | -6 | -6 | -38 |
| [agent/model/adminSchema.js](/agent/model/adminSchema.js) | JavaScript | -33 | 0 | -4 | -37 |
| [agent/model/agentSchema.js](/agent/model/agentSchema.js) | JavaScript | -60 | -1 | -8 | -69 |
| [agent/model/bookingsSchema.js](/agent/model/bookingsSchema.js) | JavaScript | -174 | -10 | -12 | -196 |
| [agent/model/lotterySchema.js](/agent/model/lotterySchema.js) | JavaScript | -59 | -5 | -9 | -73 |
| [agent/model/seoSchema.js](/agent/model/seoSchema.js) | JavaScript | -24 | -3 | -3 | -30 |
| [agent/model/ticketChargeSchema.js](/agent/model/ticketChargeSchema.js) | JavaScript | -8 | -1 | -3 | -12 |
| [agent/nodemon.json](/agent/nodemon.json) | JSON | -16 | 0 | 0 | -16 |
| [agent/package.json](/agent/package.json) | JSON | -24 | 0 | -1 | -25 |
| [agent/public/stylesheets/style.css](/agent/public/stylesheets/style.css) | PostCSS | -7 | 0 | -2 | -9 |
| [agent/routes/adminAuth.js](/agent/routes/adminAuth.js) | JavaScript | -15 | -1 | -4 | -20 |
| [agent/routes/agent.js](/agent/routes/agent.js) | JavaScript | -24 | -6 | -7 | -37 |
| [agent/routes/bookings.js](/agent/routes/bookings.js) | JavaScript | -182 | -11 | -16 | -209 |
| [agent/routes/index.js](/agent/routes/index.js) | JavaScript | -244 | -58 | -89 | -391 |
| [agent/routes/settings.js](/agent/routes/settings.js) | JavaScript | -14 | -8 | -6 | -28 |
| [agent/views/error.ejs](/agent/views/error.ejs) | HTML | -336 | -23 | -51 | -410 |
| [agent/views/index.ejs](/agent/views/index.ejs) | HTML | -1,135 | -32 | -232 | -1,399 |
| [agent/views/pages/Auth/agent-login.ejs](/agent/views/pages/Auth/agent-login.ejs) | HTML | -619 | -2 | -100 | -721 |
| [agent/views/pages/agent/listing.ejs](/agent/views/pages/agent/listing.ejs) | HTML | -1,538 | -15 | -254 | -1,807 |
| [agent/views/pages/booking/listing.ejs](/agent/views/pages/booking/listing.ejs) | HTML | -1,448 | -17 | -219 | -1,684 |
| [agent/views/pages/lottery-booking.ejs](/agent/views/pages/lottery-booking.ejs) | HTML | -1,983 | -36 | -346 | -2,365 |
| [agent/views/pages/settings/metaSettingPartal.ejs](/agent/views/pages/settings/metaSettingPartal.ejs) | HTML | -54 | -3 | -5 | -62 |
| [agent/views/pages/settings/setting copy.ejs](/agent/views/pages/settings/setting%20copy.ejs) | HTML | -793 | -45 | -156 | -994 |
| [agent/views/pages/settings/setting.ejs](/agent/views/pages/settings/setting.ejs) | HTML | -586 | -2 | -100 | -688 |
| [agent/views/partials/Edit-create-extention.ejs](/agent/views/partials/Edit-create-extention.ejs) | HTML | -1,380 | -6 | -219 | -1,605 |
| [agent/views/partials/Footer.ejs](/agent/views/partials/Footer.ejs) | HTML | -264 | -6 | -54 | -324 |
| [agent/views/partials/indexScript.ejs](/agent/views/partials/indexScript.ejs) | HTML | -75 | 0 | -12 | -87 |
| [agent/views/partials/past.ejs](/agent/views/partials/past.ejs) | HTML | -378 | -25 | -60 | -463 |
| [agent/views/partials/ticketChargeExtention.ejs](/agent/views/partials/ticketChargeExtention.ejs) | HTML | -789 | -8 | -140 | -937 |
| [agent/views/partials/todays-results.ejs](/agent/views/partials/todays-results.ejs) | HTML | -248 | -13 | -33 | -294 |
| [agent/views/partials/upcoming-lotteries.ejs](/agent/views/partials/upcoming-lotteries.ejs) | HTML | -215 | -14 | -36 | -265 |
| [agent/views/partials/winning-numbers copy.ejs](/agent/views/partials/winning-numbers%20copy.ejs) | HTML | -169 | -1 | -33 | -203 |
| [agent/views/partials/winning-numbers.ejs](/agent/views/partials/winning-numbers.ejs) | HTML | -271 | -1 | -50 | -322 |
| [agent/views/template.ejs](/agent/views/template.ejs) | HTML | -375 | -6 | -71 | -452 |
| [client/.env](/client/.env) | Properties | 2 | 0 | 0 | 2 |
| [client/app.js](/client/app.js) | JavaScript | 30 | 5 | 11 | 46 |
| [client/config/connection.js](/client/config/connection.js) | JavaScript | 17 | 0 | 4 | 21 |
| [client/helper/indexHelper.js](/client/helper/indexHelper.js) | JavaScript | 162 | 13 | 33 | 208 |
| [client/helper/startingHelper.js](/client/helper/startingHelper.js) | JavaScript | 261 | 729 | 6 | 996 |
| [client/model/lotterySchema.js](/client/model/lotterySchema.js) | JavaScript | 58 | 0 | 9 | 67 |
| [client/nodemon.json](/client/nodemon.json) | JSON | 16 | 0 | 0 | 16 |
| [client/public/stylesheets/style.css](/client/public/stylesheets/style.css) | PostCSS | 7 | 0 | 2 | 9 |
| [client/routes/index.js](/client/routes/index.js) | JavaScript | 24 | 1 | 7 | 32 |
| [client/routes/users.js](/client/routes/users.js) | JavaScript | 27 | 0 | 8 | 35 |
| [client/views/checkTime.ejs](/client/views/checkTime.ejs) | HTML | 66 | 11 | 10 | 87 |
| [client/views/error.ejs](/client/views/error.ejs) | HTML | 339 | 23 | 49 | 411 |
| [client/views/index.ejs](/client/views/index.ejs) | HTML | 876 | 14 | 187 | 1,077 |
| [client/views/partials/Edit-create-extention.ejs](/client/views/partials/Edit-create-extention.ejs) | HTML | 1,020 | 6 | 169 | 1,195 |
| [client/views/partials/indexScript.ejs](/client/views/partials/indexScript.ejs) | HTML | 75 | 0 | 12 | 87 |
| [client/views/partials/past copy.ejs](/client/views/partials/past%20copy.ejs) | HTML | 194 | 36 | 35 | 265 |
| [client/views/partials/past.ejs](/client/views/partials/past.ejs) | HTML | 239 | 12 | 35 | 286 |
| [client/views/partials/pastNeed.ejs](/client/views/partials/pastNeed.ejs) | HTML | 57 | 1 | 7 | 65 |
| [client/views/partials/todays-results.ejs](/client/views/partials/todays-results.ejs) | HTML | 248 | 13 | 33 | 294 |
| [client/views/partials/upcoming-lotteries copy.ejs](/client/views/partials/upcoming-lotteries%20copy.ejs) | HTML | 82 | 7 | 7 | 96 |
| [client/views/partials/upcoming-lotteries.ejs](/client/views/partials/upcoming-lotteries.ejs) | HTML | 205 | 13 | 36 | 254 |
| [client/views/partials/winning-numbers.ejs](/client/views/partials/winning-numbers.ejs) | HTML | 271 | 1 | 49 | 321 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details