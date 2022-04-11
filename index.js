require("dotenv").config();
const express = require("express");
const app = express();
const usersRoutes = require("./src/users/routes/usersRoutes");
const postsRoutes = require("./src/posts/routes/postsRoutes");
const commentsRoutes = require("./src/comments/routes/commentsRoutes");
const dbConnection = require("./configration/config.js");
const xlsx = require("xlsx");
const Post = require("./src/posts/Model/postModel");
const { createInvoice } = require("./common/services/createPdf");
const User = require("./src/users/Model/userModel");
const runJobs = require("./common/services/jobs/run");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

runJobs()

dbConnection();
app.use(usersRoutes);
app.use(postsRoutes);
app.use(commentsRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/insertPosts", async (req, res) => {
  const workBook = xlsx.readFile("posts.xlsx", { cellDates: true });
  const workSheet = workBook.Sheets[workBook.SheetNames[1]];
  let data = xlsx.utils.sheet_to_json(workSheet);
  console.log(data);
  let posts = [];
  data.forEach((obj) => {
    let newPost = new Post({
      post_content: Object.values(obj)[1],
    });
    posts.push(newPost);
  });
  const result = await Post.insertMany(posts);
  res.json({ data: result });
});

app.get("/createPdf", async (req, res) => {
  const getDate = new Date().getDate() - 1;
  const setHours = new Date().setHours(0, 0, 0, 0);
  const setDate = new Date(setHours).setDate(getDate);
  const yesterday = new Date(setDate).toISOString();
  // new Date( new Date().setDate( new Date().getDate()-1)).toISOString()
  // console.log(yesterday);
  const users = await User.find({
    createdAt: { $gte: yesterday },
    createdAt: { $lte: new Date(setHours).toISOString() },
  });
  // console.log(users);
  const invoice = {
    shipping: {
      name: "John Doe",
      address: "1234 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111,
    },
    items: [
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000,
      },
      {
        item: "USB_EXT",
        description: "USB Cable Extender",
        quantity: 1,
        amount: 2000,
      },
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234,
  };

  createInvoice(invoice, "invoice.pdf", users);
});

app.listen(port, () => {
  console.log(`App listening in port ${port}!`);
});
