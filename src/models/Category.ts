import mongoose, { Document, Schema } from 'mongoose';

// Define the ICategory interface which extends mongoose's Document interface.
export interface ICategory extends Document {
  name: string; // Name of the category
  salonId: mongoose.Types.ObjectId; // Reference to the associated salon
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Category schema.
const CategorySchema: Schema = new Schema({
  name: { type: String, required: true }, // Name of the category
  salonId: { type: mongoose.Types.ObjectId, ref: 'Salon', required: true },  
  // Reference to the associated salon
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Category model.
const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
