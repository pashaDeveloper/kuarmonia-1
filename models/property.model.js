import { Schema, model, models } from "mongoose";
import connectDB from "@/libs/db";
import baseSchema from "./baseSchema.model";
import Counter from "./counter.model";
import Tag from "./tag.model";

connectDB();

const socialLinkSchema = new Schema({
  name: {
    type: String,
    required: [true, "نام شبکه اجتماعی الزامی است"],
    trim: true,
    enum: {
      values: ["Facebook", "Twitter", "LinkedIn", "Instagram", "Other"],
      message: "نام شبکه اجتماعی معتبر نیست"
    }
  },
  url: {
    type: String,
    required: [true, "لینک شبکه اجتماعی الزامی است"],
    trim: true,
    match: [
      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/,
      "لینک شبکه اجتماعی معتبر نیست"
    ]
  }
});

const propertySchema = new Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      default: () => `property_${new Date().getTime()}`
    },
    title: {
      type: String,
      required: [true, "لطفاً عنوان ملک را وارد کنید"],
      trim: true,
      maxLength: [50, "عنوان نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"]
    },
    slug: {
      type: String,
      unique: true,
      default: function () {
        return this.title
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/[\s\ـ]+/g, "-")
          .replace(/[^\u0600-\u06FFa-z0-9\-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
    },
    summary: {
      type: String,
      maxLength: [160, "توضیحات نمی‌تواند بیشتر از ۱۶۰ کاراکتر باشد"]
    },
    description: {
      type: String,
      required: [true, "لطفاً توضیحات ملک را وارد کنید"],
      trim: true
    },
    type: {
      type: String,
      enum: ["apartment", "villa", "office", "land"],
      required: [true, "لطفاً نوع ملک را مشخص کنید"]
    },
    listingType: {
      type: String,
      enum: ["for sale", "for rent"],
      required: [true, "لطفاً نوع لیست ملک را مشخص کنید"]
    },
    price: {
      type: Number,
      required: [true, "لطفاً قیمت ملک را وارد کنید"]
    },
    currency: {
      type: String,
      enum: ["TRY", "USD", "EUR"],
      default: "TRY"
    },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      neighborhood: { type: String }
    },
    address: {
      type: String,
      required: [true, "لطفاً آدرس ملک را وارد کنید"]
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    area: {
      type: Number,
      required: [true, "لطفاً مساحت ملک را وارد کنید"]
    },
    bedrooms: {
      type: Number,
      default: 0
    },
    bathrooms: {
      type: Number,
      default: 0
    },
    livingRooms: {
      type: Number,
      default: 0
    },
    amenities: [
      {
        type: String,
        enum: ["pool", "parking", "sauna"]
      }
    ],
    images: [
      {
        url: String,
        public_id: String
      }
    ],
    featuredImage: {
      type: String,
      default: "https://placehold.co/600x400.png"
    },
    gallery: [
      {
        url: {
          type: String,
          default: "https://placehold.co/296x200.png"
        },
        public_id: {
          type: String,
          default: "N/A"
        }
      }
    ],
    constructionYear: {
      type: Number
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    listedDate: {
      type: Date,
      default: Date.now
    },
    updatedDate: {
      type: Date,
      default: Date.now
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    furnished: {
      type: Boolean,
      default: false
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: [true, "تگ ملک الزامی است"]
      }
    ],
    contactNumber: {
      type: String,
      required: [true, "لطفاً شماره تماس را وارد کنید"]
    },
    metaTitle: {
      type: String,
      maxLength: [60, "متا تایتل نمی‌تواند بیشتر از ۶۰ کاراکتر باشد"],
      default: ""
    },
    metaDescription: {
      type: String,
      maxLength: [160, "متا توضیحات نمی‌تواند بیشتر از ۱۶۰ کاراکتر باشد"],
      default: ""
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    metaRobots: {
      type: String,
      default: "index, follow"
    },
    canonicalUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: "URL معتبر نیست"
      }
    },
    availability: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه نویسنده الزامی است"]
    },
    bookmarkedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "like"
      }
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "like"
      }
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    features: [
      {
        title: {
          type: String,
          required: [true, "لطفاً عنوان ویژگی را وارد کنید"],
          maxLength: [100, "عنوان ویژگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"]
        },
        content: {
          type: [String],
          required: [true, "لطفاً محتوای ویژگی را وارد کنید"],
          maxLength: [200, "محتوا نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد"]
        }
      }
    ],
    views: {
        type: Number,
        default: 0,
        min: [0, "تعداد بازدید نمی‌تواند منفی باشد"]
      },
    ...baseSchema.obj
},
{ timestamps: true }
);
const defaultDomain = process.env.NEXT_PUBLIC_BASE_URL;

propertySchema.pre("save", async function (next) {
  // تنظیمات Meta
  if (!this.metaTitle) {
    this.metaTitle =
      this.title.length > 60 ? this.title.substring(0, 60) : this.title;
  }

  if (!this.metaDescription) {
    this.metaDescription =
      this.summary?.length > 160
        ? this.summary.substring(0, 160)
        : this.summary;
  }

  if (!this.metaKeywords || this.metaKeywords.length === 0) {
    const keywords = [];
    if (this.tags?.length > 0) {
      this.tags.forEach((tag) => keywords.push(tag.name || tag)); // توجه به اینکه تگ‌ها ممکن است آبجکت باشند
    }
    keywords.push(this.type);
    this.metaKeywords = keywords.slice(0, 10);
  }

  // تنظیم propertyId و canonicalUrl
  if (this.isNew) {
    this.propertyId = await getNextSequenceValue("propertyId");
  }

  if (!this.canonicalUrl) {
    this.canonicalUrl = `${defaultDomain}/propert/${this.slug}`;
  }

  next();
});

const Property = models.Property || model("Property", propertySchema);
export default Property;

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { model: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}
