# Diff Details

Date : 2025-10-29 12:05:18

Directory /home/jadhu/projects/Demo_Project/bhutanchoice.com/agent

Total : 90 files,  -3413 codes, -277 comments, -526 blanks, all -4216 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [admin/.env](/admin/.env) | Properties | -5 | 0 | 0 | -5 |
| [admin/app.js](/admin/app.js) | JavaScript | -44 | -6 | -13 | -63 |
| [admin/config/connection.js](/admin/config/connection.js) | JavaScript | -17 | 0 | -4 | -21 |
| [admin/helper/adminHelper.js](/admin/helper/adminHelper.js) | JavaScript | -82 | -7 | -22 | -111 |
| [admin/helper/agentHelper.js](/admin/helper/agentHelper.js) | JavaScript | -270 | -19 | -48 | -337 |
| [admin/helper/bookingHelper copy.js](/admin/helper/bookingHelper%20copy.js) | JavaScript | -14 | 0 | -6 | -20 |
| [admin/helper/bookingHelper.js](/admin/helper/bookingHelper.js) | JavaScript | -448 | -50 | -81 | -579 |
| [admin/helper/indexHelper.js](/admin/helper/indexHelper.js) | JavaScript | -1,336 | -134 | -183 | -1,653 |
| [admin/helper/settingHelper.js](/admin/helper/settingHelper.js) | JavaScript | -121 | -3 | -17 | -141 |
| [admin/helper/startingHelper.js](/admin/helper/startingHelper.js) | JavaScript | -741 | -589 | -4 | -1,334 |
| [admin/helper/verifyAdmin.js](/admin/helper/verifyAdmin.js) | JavaScript | -23 | -6 | -6 | -35 |
| [admin/model/adminSchema.js](/admin/model/adminSchema.js) | JavaScript | -36 | 0 | -4 | -40 |
| [admin/model/agentSchema.js](/admin/model/agentSchema.js) | JavaScript | -60 | -1 | -8 | -69 |
| [admin/model/bookingsSchema.js](/admin/model/bookingsSchema.js) | JavaScript | -173 | -10 | -12 | -195 |
| [admin/model/lotterySchema.js](/admin/model/lotterySchema.js) | JavaScript | -59 | -5 | -9 | -73 |
| [admin/model/seoSchema.js](/admin/model/seoSchema.js) | JavaScript | -24 | -3 | -3 | -30 |
| [admin/model/ticketChargeSchema.js](/admin/model/ticketChargeSchema.js) | JavaScript | -8 | -1 | -3 | -12 |
| [admin/nodemon.json](/admin/nodemon.json) | JSON | -16 | 0 | 0 | -16 |
| [admin/public/stylesheets/style.css](/admin/public/stylesheets/style.css) | PostCSS | -7 | 0 | -2 | -9 |
| [admin/routes/adminAuth.js](/admin/routes/adminAuth.js) | JavaScript | -29 | -2 | -4 | -35 |
| [admin/routes/agent.js](/admin/routes/agent.js) | JavaScript | -24 | -6 | -7 | -37 |
| [admin/routes/bookings copy.js](/admin/routes/bookings%20copy.js) | JavaScript | -633 | -22 | -37 | -692 |
| [admin/routes/bookings.js](/admin/routes/bookings.js) | JavaScript | -177 | -19 | -15 | -211 |
| [admin/routes/index.js](/admin/routes/index.js) | JavaScript | -88 | -370 | -107 | -565 |
| [admin/routes/settings.js](/admin/routes/settings.js) | JavaScript | -21 | -1 | -6 | -28 |
| [admin/views/error.ejs](/admin/views/error.ejs) | HTML | -336 | -23 | -51 | -410 |
| [admin/views/index.ejs](/admin/views/index.ejs) | HTML | -1,284 | -24 | -252 | -1,560 |
| [admin/views/pages/Auth/admin-login copy.ejs](/admin/views/pages/Auth/admin-login%20copy.ejs) | HTML | -619 | -18 | -102 | -739 |
| [admin/views/pages/Auth/admin-login.ejs](/admin/views/pages/Auth/admin-login.ejs) | HTML | -619 | -2 | -100 | -721 |
| [admin/views/pages/agent/listing.ejs](/admin/views/pages/agent/listing.ejs) | HTML | -1,575 | -15 | -264 | -1,854 |
| [admin/views/pages/booking/listing.ejs](/admin/views/pages/booking/listing.ejs) | HTML | -1,746 | -20 | -270 | -2,036 |
| [admin/views/pages/lottery-booking.ejs](/admin/views/pages/lottery-booking.ejs) | HTML | -1,958 | -36 | -341 | -2,335 |
| [admin/views/pages/receipt copy.ejs](/admin/views/pages/receipt%20copy.ejs) | HTML | -743 | -10 | -104 | -857 |
| [admin/views/pages/receipt.ejs](/admin/views/pages/receipt.ejs) | HTML | -725 | 0 | -118 | -843 |
| [admin/views/pages/settings/metaSettingPartal.ejs](/admin/views/pages/settings/metaSettingPartal.ejs) | HTML | -54 | -3 | -5 | -62 |
| [admin/views/pages/settings/setting copy.ejs](/admin/views/pages/settings/setting%20copy.ejs) | HTML | -793 | -27 | -160 | -980 |
| [admin/views/pages/settings/setting.ejs](/admin/views/pages/settings/setting.ejs) | HTML | -815 | -4 | -161 | -980 |
| [admin/views/partials/Edit-create-extention.ejs](/admin/views/partials/Edit-create-extention.ejs) | HTML | -1,381 | -6 | -221 | -1,608 |
| [admin/views/partials/Footer.ejs](/admin/views/partials/Footer.ejs) | HTML | -265 | -2 | -52 | -319 |
| [admin/views/partials/indexScript.ejs](/admin/views/partials/indexScript.ejs) | HTML | -75 | 0 | -12 | -87 |
| [admin/views/partials/past.ejs](/admin/views/partials/past.ejs) | HTML | -249 | -13 | -36 | -298 |
| [admin/views/partials/ticketChargeExtention.ejs](/admin/views/partials/ticketChargeExtention.ejs) | HTML | -789 | -8 | -140 | -937 |
| [admin/views/partials/todays-results.ejs](/admin/views/partials/todays-results.ejs) | HTML | -248 | -13 | -33 | -294 |
| [admin/views/partials/upcoming-lotteries.ejs](/admin/views/partials/upcoming-lotteries.ejs) | HTML | -215 | -14 | -38 | -267 |
| [admin/views/partials/winning-numbers.ejs](/admin/views/partials/winning-numbers.ejs) | HTML | -271 | -1 | -50 | -322 |
| [admin/views/template.ejs](/admin/views/template.ejs) | HTML | -375 | -6 | -71 | -452 |
| [agent/.env](/agent/.env) | Properties | 4 | 0 | 0 | 4 |
| [agent/app.js](/agent/app.js) | JavaScript | 44 | 6 | 13 | 63 |
| [agent/config/connection.js](/agent/config/connection.js) | JavaScript | 17 | 0 | 4 | 21 |
| [agent/helper/agentAuthHelper.js](/agent/helper/agentAuthHelper.js) | JavaScript | 58 | 5 | 16 | 79 |
| [agent/helper/agentHelper.js](/agent/helper/agentHelper.js) | JavaScript | 265 | 18 | 47 | 330 |
| [agent/helper/bookingHelper copy.js](/agent/helper/bookingHelper%20copy.js) | JavaScript | 14 | 0 | 6 | 20 |
| [agent/helper/bookingHelper.js](/agent/helper/bookingHelper.js) | JavaScript | 421 | 155 | 89 | 665 |
| [agent/helper/indexHelper.js](/agent/helper/indexHelper.js) | JavaScript | 930 | 81 | 116 | 1,127 |
| [agent/helper/settingHelper.js](/agent/helper/settingHelper.js) | JavaScript | 118 | 3 | 20 | 141 |
| [agent/helper/startingHelper.js](/agent/helper/startingHelper.js) | JavaScript | 741 | 589 | 4 | 1,334 |
| [agent/helper/verifyAgent.js](/agent/helper/verifyAgent.js) | JavaScript | 26 | 6 | 6 | 38 |
| [agent/model/adminSchema.js](/agent/model/adminSchema.js) | JavaScript | 33 | 0 | 4 | 37 |
| [agent/model/agentSchema.js](/agent/model/agentSchema.js) | JavaScript | 60 | 1 | 8 | 69 |
| [agent/model/bookingsSchema.js](/agent/model/bookingsSchema.js) | JavaScript | 174 | 10 | 12 | 196 |
| [agent/model/lotterySchema.js](/agent/model/lotterySchema.js) | JavaScript | 59 | 5 | 9 | 73 |
| [agent/model/seoSchema.js](/agent/model/seoSchema.js) | JavaScript | 24 | 3 | 3 | 30 |
| [agent/model/ticketChargeSchema.js](/agent/model/ticketChargeSchema.js) | JavaScript | 8 | 1 | 3 | 12 |
| [agent/nodemon.json](/agent/nodemon.json) | JSON | 16 | 0 | 0 | 16 |
| [agent/package.json](/agent/package.json) | JSON | 24 | 0 | 1 | 25 |
| [agent/public/stylesheets/style.css](/agent/public/stylesheets/style.css) | PostCSS | 7 | 0 | 2 | 9 |
| [agent/routes/adminAuth.js](/agent/routes/adminAuth.js) | JavaScript | 15 | 1 | 4 | 20 |
| [agent/routes/agent.js](/agent/routes/agent.js) | JavaScript | 24 | 6 | 7 | 37 |
| [agent/routes/bookings.js](/agent/routes/bookings.js) | JavaScript | 182 | 11 | 16 | 209 |
| [agent/routes/index.js](/agent/routes/index.js) | JavaScript | 244 | 58 | 89 | 391 |
| [agent/routes/settings.js](/agent/routes/settings.js) | JavaScript | 14 | 8 | 6 | 28 |
| [agent/views/error.ejs](/agent/views/error.ejs) | HTML | 336 | 23 | 51 | 410 |
| [agent/views/index.ejs](/agent/views/index.ejs) | HTML | 1,135 | 32 | 232 | 1,399 |
| [agent/views/pages/Auth/agent-login.ejs](/agent/views/pages/Auth/agent-login.ejs) | HTML | 619 | 2 | 100 | 721 |
| [agent/views/pages/agent/listing.ejs](/agent/views/pages/agent/listing.ejs) | HTML | 1,538 | 15 | 254 | 1,807 |
| [agent/views/pages/booking/listing.ejs](/agent/views/pages/booking/listing.ejs) | HTML | 1,448 | 17 | 219 | 1,684 |
| [agent/views/pages/lottery-booking.ejs](/agent/views/pages/lottery-booking.ejs) | HTML | 1,983 | 36 | 346 | 2,365 |
| [agent/views/pages/settings/metaSettingPartal.ejs](/agent/views/pages/settings/metaSettingPartal.ejs) | HTML | 54 | 3 | 5 | 62 |
| [agent/views/pages/settings/setting copy.ejs](/agent/views/pages/settings/setting%20copy.ejs) | HTML | 793 | 45 | 156 | 994 |
| [agent/views/pages/settings/setting.ejs](/agent/views/pages/settings/setting.ejs) | HTML | 586 | 2 | 100 | 688 |
| [agent/views/partials/Edit-create-extention.ejs](/agent/views/partials/Edit-create-extention.ejs) | HTML | 1,380 | 6 | 219 | 1,605 |
| [agent/views/partials/Footer.ejs](/agent/views/partials/Footer.ejs) | HTML | 264 | 6 | 54 | 324 |
| [agent/views/partials/indexScript.ejs](/agent/views/partials/indexScript.ejs) | HTML | 75 | 0 | 12 | 87 |
| [agent/views/partials/past.ejs](/agent/views/partials/past.ejs) | HTML | 378 | 25 | 60 | 463 |
| [agent/views/partials/ticketChargeExtention.ejs](/agent/views/partials/ticketChargeExtention.ejs) | HTML | 789 | 8 | 140 | 937 |
| [agent/views/partials/todays-results.ejs](/agent/views/partials/todays-results.ejs) | HTML | 248 | 13 | 33 | 294 |
| [agent/views/partials/upcoming-lotteries.ejs](/agent/views/partials/upcoming-lotteries.ejs) | HTML | 215 | 14 | 36 | 265 |
| [agent/views/partials/winning-numbers copy.ejs](/agent/views/partials/winning-numbers%20copy.ejs) | HTML | 169 | 1 | 33 | 203 |
| [agent/views/partials/winning-numbers.ejs](/agent/views/partials/winning-numbers.ejs) | HTML | 271 | 1 | 50 | 322 |
| [agent/views/template.ejs](/agent/views/template.ejs) | HTML | 375 | 6 | 71 | 452 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details