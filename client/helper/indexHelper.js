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

      // Sort past by newest first and limit to 7
      past.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
      const limitedPast = past.slice(0, 7);
      
      console.log('\nTodays__:\n',todays)
    // return res.json({todays,
    //       upcoming,
    //       past: limitedPast})
    let filteredUpcoming=[]
     filteredUpcoming.push(upcoming[0])
      return res.render('index',{
          todays,
          upcoming:filteredUpcoming,
          past: limitedPast
        })     
    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching lotteries.' });
    }
  },
  getPastLotteries: async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      // Fetch total count (optional, for frontend pagination)
      const total = await Lottery.countDocuments({ drawDate: { $lt: today } });

      // Fetch paginated past lotteries
      const pastLotteries = await Lottery.find({ drawDate: { $lt: today } })
        .sort({ drawDate: -1 }) // Newest first
        .skip(skip)
        .limit(limit);

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const formatted = pastLotteries.map(lottery => {
        const drawDate = new Date(lottery.drawDate);
        const dayName = weekdays[drawDate.getDay()];
        return { ...lottery._doc, dayName };
      });
      if(formatted.length<1){
         return res.status(404).json({ success: false, message: 'No past lotteries found' });
      }
      return res.json({
        success: true,
        data: {
          page,
          total,
          items: formatted
        }
      });

    } catch (err) {
      console.error("Error in getPastLotteries:", err);
      return res.status(500).json({ success: false, message: 'Failed to fetch past lotteries' });
    }
  }
}
module.exports=indexHelper