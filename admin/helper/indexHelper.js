const Lottery = require('../model/lotterySchema'); // Your model

const indexHelper = {
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
      if (formatted.length < 1) {
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
  },
  createLottery: async (req, res) => {
    try {
      const { name, drawNumber, drawDate, prizes } = req.body;

      // Optional: Validate incoming data manually if needed
      if (!name || !drawNumber || !drawDate || !Array.isArray(prizes)) {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
      }

      const newLottery = new Lottery({
        name,
        drawNumber,
        drawDate,
        prizes,
        winners: [] // initialize as empty array
      });

      const savedLottery = await newLottery.save();
      console.log("\nLottery created successfully:\n", savedLottery);
      return res.status(200).json({
        success: true,
        message: 'Lottery created successfully',
        data: savedLottery
      });
    } catch (err) {
      console.error("Error in createLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to create lottery' });
    }
  },
  updateLottery: async (req, res) => {
    try {
      const lotteryId = req.params.id;
      const { name, drawNumber, drawDate, prizes, winners } = req.body;

      if (!lotteryId) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
      }

      const updateData = {};

      if (name) updateData.name = name;
      if (drawNumber) updateData.drawNumber = drawNumber;
      if (drawDate) updateData.drawDate = drawDate;
      if (prizes) updateData.prizes = prizes;
      if (winners) updateData.winners = winners;

      updateData.updatedAt = new Date();

      const updatedLottery = await Lottery.findByIdAndUpdate(
        lotteryId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedLottery) {
        return res.status(404).json({ success: false, message: 'Lottery not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Lottery updated successfully',
        data: updatedLottery
      });

    } catch (err) {
      console.error("Error in updateLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to update lottery' });
    }
  },
  getLottery: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
      }

      const lottery = await Lottery.findById(id).select('_id name drawNumber drawDate prizes winners');

      if (!lottery) {
        return res.status(404).json({ success: false, message: 'Lottery not found' });
      }

      return res.status(200).json({
        success: true,
        data: lottery
      });

    } catch (err) {
      console.error("Error in getLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to fetch lottery' });
    }
  },
  deleteLottery: async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Lottery ID is required' });
    }

    const deletedLottery = await Lottery.findByIdAndDelete(id);

    if (!deletedLottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found or already deleted' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lottery deleted successfully',
      // data: deletedLottery
    });

  } catch (err) {
    console.error("Error in deleteLottery:", err);
    return res.status(500).json({ success: false, message: 'Failed to delete lottery' });
  }
},


}
module.exports = indexHelper