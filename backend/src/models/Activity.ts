import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    status: { type: String, enum: ["PENDING", "PUBLISHED"], default: "PENDING" },
    tag: {
      type: String,
      enum: ["Vaccination", "Emergency", "Checkup", "Inspection", "Campaign", "General"],
      default: "General",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
