var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://marawansalman:maromaro1212@cairo-belguim.xqxi1.mongodb.net/cairo-belguim', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Your DB (cairo-belguim) Connected");
});

