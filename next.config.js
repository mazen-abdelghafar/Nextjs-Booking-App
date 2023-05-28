module.exports = {
  reactStrictMode: true,
  env: {
    // mongo db config
    DB_URI: "",

    // stripe payment config
    STRIPE_API_KEY: "",
    STRIPE_SECRET_KEY: "",
    STRIPE_WEBHOOK_SECRET: "",

    // cloudinary images config
    CLOUDINARY_CLOUD_NAME: "",
    CLOUDINARY_API_KEY: "",
    CLOUDINARY_API_SECRET: "",

    // nodemailer config
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_USER: "",
    SMTP_PASSWORD: "",
    SMTP_FROM_NAME: "",
    SMTP_FROM_EMAIL: "",
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};
