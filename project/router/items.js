const asyncmiddleware=require('../middleware/tryCatch');
const { Item, validateitem } = require('../module/item');
const express = require('express');
const _ = require('lodash');
const { User } = require('../module/user');
const router = express.Router();
const auth = require('../middleware/auths');

router.get('/', asyncmiddleware(async (req, res) => {
    const item = await Item.find().sort({ name: 1 });
    res.send(item);
}));
router.get('/my_items/:id', asyncmiddleware( async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item){
            res.status(400).send("invilid id ");
            return;
        }
        res.send(item);
    }
    catch (ex) {
        res.send("internal error");
    }
}));
router.get('/my_items/', auth, async (req, res) => {
    console.log(req.user._id);
    const items = await Item.find({ user_id: req.user._id }).select({ _id: 0, user_id: 0 });
    res.send(items);
});
router.post('/', auth, async (req, res) => {
    const { error } = validateitem(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    let item = new Item(_.pick(req.body, ['name', 'price', 'quantity', 'description', 'time']));
    item.user_id = req.user._id;
    item = await item.save();
    res.send(_.pick(item, ['name', 'price', 'quantity']));
});
router.delete('/my_items/:id', auth, async (req, res) => {
    // console.log(req);
    let items = await Item.findById(req.params.id);
    if (!items) {
        res.status(400).send('following id is not valid');
        return;
    }
    if (items.user_id == req.user._id) {
        items = await Item.findByIdAndRemove(req.params.id);
    }
    else {
        res.status(401).send('specific item does not belong to this user');
        return;
    }
    res.send(items);
});
module.exports = router;