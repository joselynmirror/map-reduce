import mongoose from "mongoose";

const username = "joselyn";
const password = "uneg";
const uri = `mongodb+srv://${username}:${password}@cluster0.txa5mwb.mongodb.net/words?retryWrites=true&w=majority&appName=Cluster0`;

const WordModel = mongoose.model(
  "Word",
  new mongoose.Schema({ key: String, value: Number })
);

export const increment = async (key, value) => {
  await mongoose.connect(uri);

  await WordModel.findOneAndUpdate(
    { key },
    { $inc: { value: value } },
    { new: true, upsert: true }
  );
};
