import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const viewLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const circularSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    attachments: { type: [String], default: [] },
    priority: {
      type: String,
      enum: ["Normal", "Urgent", "Critical"],
      default: "Normal",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipients: {
      type: String,
      enum: ["ALL", "STAFF", "ADMIN"],
      default: "ALL",
    },
    followUps: [followUpSchema],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewLog: [viewLogSchema],
  },
  { timestamps: true }
);

const Circular = mongoose.model("Circular", circularSchema);
export default Circular;
