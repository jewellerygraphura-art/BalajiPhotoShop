import mongoose, { Schema } from "mongoose";

const userOrderSchema = new Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true }, 

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true }, 
  
    items: [
    {
      name: { 
        type: String, 
        required: true },

      quantity: { 
        type: Number, 
        required: true },
    }
  ],
  status: {
    type: String,
    enum: ['Order Placed', 'Accepted', 'In Progress', 'On The Way', 'Delivered'],
    default: 'Order Placed'
  },
  createdAt: { 
    type: Date, 
    default: Date.now },

  updatedAt: { 
    type: Date, 
    default: Date.now }
});

userOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
});

userOrderSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  
});

const userOrderModel = mongoose.model('UserOrder', userOrderSchema);

export default userOrderModel;