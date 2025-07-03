const Lottery = require('../model/lotterySchema'); // Your model

const indexHelper={
 getLotteries: async (req, res) => {
    try {
      const allLotteries = await Lottery.find({});

      const today = new Date();
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

      // Sort past by newest first and limit to 30
      past.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
      const limitedPast = past.slice(0, 30);
      
      console.log(limitedPast)
    //   return res.json({limitedPast})
      return res.render('index',{
          todays,
          upcoming,
          past: limitedPast
        })
      

    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching lotteries.' });
    }
  }
}
module.exports=indexHelper