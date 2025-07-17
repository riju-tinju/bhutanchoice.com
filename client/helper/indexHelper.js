const moment = require('moment-timezone');
const Lottery = require('../model/lotterySchema'); // Your model

const indexHelper = {
  getLotteries1: async (req, res) => {
    try {
      const allLotteries = await Lottery.find({});

      // const today = new Date();
      const today = moment().tz('Asia/Thimphu').toDate();
      console.log("Today:", today);
      today.setHours(0, 0, 0, 0); // Start of today
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const todays = [];
      const upcoming = [];
      const past = [];

      allLotteries.forEach(lottery => {
        const drawDate = new Date(lottery.drawDate);
        const dayName = weekdays[drawDate.getDay()];
        const lotteryWithDay = { ...lottery._doc, dayName };

        if (drawDate >= today && drawDate < tomorrow) {
          todays.push(lotteryWithDay);
        } else if (drawDate > today) {
          upcoming.push(lotteryWithDay);
        } else {
          past.push(lotteryWithDay);
        }
      });

      // Sort past by newest first and limit to 7
      past.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
      const limitedPast = past.slice(0, 7);

      console.log('\nTodays__:\n', todays)
      // return res.json({todays,
      //       upcoming,
      //       past: limitedPast})
      let filteredUpcoming = []
      if (upcoming.length > 0) filteredUpcoming.push(upcoming[0])
      return res.render('index', {
        todays,
        upcoming: filteredUpcoming || [],
        past: limitedPast
      })
    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching lotteries.' });
    }
  },
  getLotteries: async (req, res) => {
    try {
      const allLotteries = await Lottery.find({});

      // Get Bhutan's current date (00:00:00 of today)
      const today = moment().tz("Asia/Thimphu").startOf('day');
      const tomorrow = moment(today).add(1, 'day');

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const todays = [];
      const upcoming = [];
      const past = [];

      allLotteries.forEach(lottery => {
        const drawDate = moment(lottery.drawDate).tz("Asia/Thimphu");
        const dayName = weekdays[drawDate.day()];
        const lotteryWithDay = { ...lottery._doc, dayName };

        if (drawDate.isSameOrAfter(today) && drawDate.isBefore(tomorrow)) {
          todays.push(lotteryWithDay);
        } else if (drawDate.isAfter(today)) {
          upcoming.push(lotteryWithDay);
        } else {
          past.push(lotteryWithDay);
        }
      });

      // Sort past by newest first and limit to 7
      past.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
      const limitedPast = past.slice(0, 5);
      
      let filteredUpcoming = [];
      if (upcoming.length > 0) filteredUpcoming.push(upcoming[0]);
     
      return res.render('index', {
        todays,
        upcoming: filteredUpcoming,
        past: limitedPast
      });

    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching lotteries.' });
    }
  },
  getPastLotteries1: async (req, res) => {
    try {
      const allLotteries = await Lottery.find({});

      // Get Bhutan's current date (00:00:00 of today)
      const today = moment().tz("Asia/Thimphu").startOf('day');
      const tomorrow = moment(today).add(1, 'day');

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const todays = [];
      const upcoming = [];
      const past = [];

      allLotteries.forEach(lottery => {
        const drawDate = moment(lottery.drawDate).tz("Asia/Thimphu");
        const dayName = weekdays[drawDate.day()];
        const lotteryWithDay = { ...lottery._doc, dayName };

        if (drawDate.isSameOrAfter(today) && drawDate.isBefore(tomorrow)) {
          todays.push(lotteryWithDay);
        } else if (drawDate.isAfter(today)) {
          upcoming.push(lotteryWithDay);
        } else {
          past.push(lotteryWithDay);
        }
      });

      // Sort past by newest first and limit to 7
      past.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
      const limitedPast = past.slice(0, 7);

      let filteredUpcoming = [];
      if (upcoming.length > 0) filteredUpcoming.push(upcoming[0]);

      return res.render('index', {
        todays,
        upcoming: filteredUpcoming,
        past: limitedPast
      });

    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching lotteries.' });
    }
  },
  getPastLotteries: async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1; // Default to page 1 if not provided
      const limit = 7;
      const skip = (page - 1) * limit;

      // Get current Bhutan date
      const today = moment().tz("Asia/Thimphu").startOf('day');

      // Get all past lotteries (drawDate before today)
      const allPastLotteries = await Lottery.find({
        drawDate: { $lt: today.toDate() }
      }).sort({ drawDate: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      // Add weekday name
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const items = allPastLotteries.map(lottery => {
        const drawDate = moment(lottery.drawDate).tz("Asia/Thimphu");
        const dayName = weekdays[drawDate.day()];
        return { ...lottery._doc, dayName };
      });

      return res.status(200).json({ success: true, items });
    } catch (err) {
      console.error("Error fetching past lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching past lotteries.' });
    }
  },
  refreshResults: async (req, res) => {
    try {
      const { lotteryId } = req.body;
      if (!lotteryId) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
      }

      // Find the lottery by ID
      const lottery = await Lottery.findById(lotteryId);
      if (!lottery) {
        return res.status(404).json({ success: false, message: 'Lottery not found' });
      }

      console.log("Refreshing lottery:\n", lottery);

      return res.json({
        success: true, message: 'Results refreshed successfully', data: {
          prizes: lottery.prizes,
          winners: lottery.winners,
        }
      });
    } catch (err) {
      console.error("Error in refreshResults:", err);
      return res.status(500).json({ success: false, message: 'Failed to refresh results' });
    }
  }
}
module.exports = indexHelper