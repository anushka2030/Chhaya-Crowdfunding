const mongoose = require('mongoose');
const Campaign = require('./models/campaign');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB. Fixing image paths...');

  const campaigns = await Campaign.find({ "images.url": /\\/ });

  for (let campaign of campaigns) {
    let updated = false;
    campaign.images.forEach(img => {
      if (img.url.includes('\\')) {
        img.url = img.url.replace(/\\/g, '/');
        updated = true;
      }
    });
    if (updated) {
      await campaign.save();
      console.log(`✅ Fixed campaign ID: ${campaign._id}`);
    }
  }

  console.log("🎉 All campaign image URLs cleaned successfully.");
  process.exit();
}).catch(err => {
  console.error('MongoDB error:', err);
  process.exit(1);
});
