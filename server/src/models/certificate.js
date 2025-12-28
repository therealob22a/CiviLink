import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    // Owner of the certificate (citizen)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // The application that produced this certificate
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true, // one certificate per application
    },

    category: {
      type: String,
      enum: ["TIN", "VITAL"],
      required: true,
      index: true,
    },

    // Only relevant for VITAL
    type: {
      type: String,
      enum: ["birth", "marriage", null],
      required: function () {
        return this.category === "VITAL";
      },
    },

    // Where the generated PDF is stored
    filePath: {
      type: String,
      required: true,
    },

    // Officer who approved & issued it
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
      required: true,
    },

    // Not sure whether to include this or not, but we can discuss about it.
    // status: {
    //   type: String,
    //   enum: ["active", "revoked"],
    //   default: "active",
    // },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;