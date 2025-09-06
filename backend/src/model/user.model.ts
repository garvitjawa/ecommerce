import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  name: string;
  password: string;
  cart: Array<{ productId: string; quantity: number }>;
  createdAt: Date;
}
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
