const howItWorksSchema = new mongoose.Schema({
    step: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const HowItWorks = mongoose.model("HowItWorks", howItWorksSchema);
