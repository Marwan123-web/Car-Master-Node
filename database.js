var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/the-pyramids', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Your DB (the-pyramids) Connected");
});