const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const nodemailer = require("nodemailer");

const Popup = require("./models/Popup");
const Quote = require("./models/Quote");
const Quote40 = require("./models/Quote40");
const Quote100 = require("./models/Quote100");
const excel = require("exceljs");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 3000;
validCredentials = { username: "numericx", password: "numericx@1234!" };

app.use(cors()); // Use CORS middleware

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "talhayousaf4425@gmail.com",
    pass: "pcuk nuqw ysso bpza",
  },
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware function to check session status
const checkSession = (req, res, next) => {
  if (req.session.authenticated) {
    next(); // If session is active, proceed to the next middleware or route handler
  } else {
    res.redirect("/login"); // If session is not active, redirect to login page
  }
};

// Middleware
app.use(bodyParser.json());
app.set("view engine", "ejs"); // Set EJS as view engine
app.set("views", "views"); // Set views directory

// MongoDB connection
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.qeayywk.mongodb.net/numericx", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// CRUD for Popup
app.get("/popups", async (req, res) => {
  const popups = await Popup.find();
  res.json(popups);
});

app.post("/popups", async (req, res) => {
  const newPopup = new Popup(req.body);
  try {
    const savedPopup = await newPopup.save();
    res.status(201).json(savedPopup);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.put("/popups/:id", async (req, res) => {
  const updatedPopup = await Popup.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedPopup);
});

app.delete("/popups/:id", async (req, res) => {
  const deletedPopup = await Popup.findByIdAndDelete(req.params.id);
  res.json(deletedPopup);
});

// CRUD for Quote
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/quotes", async (req, res) => {
  const newQuote = new Quote(req.body);
  try {
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.put("/quotes/:id", async (req, res) => {
  const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedQuote);
});

app.delete("/quotes/:id", async (req, res) => {
  const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
  res.json(deletedQuote);
});

// CRUD for FortyPercentQuotes
app.get("/quotes40", async (req, res) => {
  try {
    const quotes = await Quote40.find();
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/quotes40", async (req, res) => {
  const newQuote = new Quote40(req.body);
  try {
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET route to render quote40Records.ejs with all quotes
app.get("/quote40Records", checkSession, async (req, res) => {
  try {
    const quotes = await Quote40.find();
    console.log("Quotes retrieved:", quotes); // Log the retrieved quotes
    res.render("quote40Records", { quotes40: quotes });
  } catch (err) {
    console.error("Error retrieving quotes:", err); // Log detailed error information
    res.status(500).send("Internal Server Error");
  }
});

// POST request to download quotes40 as an Excel file
app.post("/download_quotes40", async (req, res) => {
  try {
    const quotes = await Quote40.find();

    // Create a new Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Quotes40");

    // Add headers
    const headers = [
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Business Type",
      "Dormant",
      "Non-Trading",
      "Free Company Formation",
      "Number of Partners",
      "Annual Turnover",
      "VAT Returns",
      "Payroll",
      "Number of Employees",
      "Pension Scheme",
      "Number of Employees Needing Enrollment",
      "Bookkeeping",
      "Number of Transactions",
      "Quote Price",
    ];
    worksheet.addRow(headers);

    // Add data
    quotes.forEach((quote) => {
      // Format timestamp
      const formattedTimestamp = moment(quote.timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      const row = [
        formattedTimestamp,
        quote.name,
        quote.email,
        quote.phone,
        quote.businessType,
        quote.dormant,
        quote.nonTrading,
        quote.freeCompanyFormation,
        quote.numberOfPartners,
        quote.annualTurnover,
        quote.vatReturns,
        quote.payrollSelect,
        quote.numberOfEmployees,
        quote.pensionScheme,
        quote.numberOfEmployeesEnrolling,
        quote.bookkeeping,
        quote.numberOfTransactions,
        quote.quotePrice,
      ];
      worksheet.addRow(row);
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=quotes40.xlsx");

    // Send the workbook as a buffer
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
});

// CRUD for OneHundredPercentQuotes
app.get("/quotes100", async (req, res) => {
  try {
    const quotes = await Quote100.find();
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/quotes100", async (req, res) => {
  const newQuote = new Quote100(req.body);
  try {
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET route to render quote100Records.ejs with all quotes
app.get("/quote100Records", checkSession, async (req, res) => {
  try {
    const quotes = await Quote100.find();
    console.log("Quotes retrieved:", quotes); // Log the retrieved quotes
    res.render("quote100Records", { quotes100: quotes });
  } catch (err) {
    console.error("Error retrieving quotes:", err); // Log detailed error information
    res.status(500).send("Internal Server Error");
  }
});

// POST request to download quotes100 as an Excel file
app.post("/download_quotes100", async (req, res) => {
  try {
    const quotes = await Quote100.find();

    // Create a new Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Quotes100");

    // Add headers
    const headers = [
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Business Type",
      "Dormant",
      "Non-Trading",
      "Free Company Formation",
      "Number of Partners",
      "Annual Turnover",
      "VAT Returns",
      "Payroll",
      "Number of Employees",
      "Pension Scheme",
      "Number of Employees Needing Enrollment",
      "Bookkeeping",
      "Number of Transactions",
      "Quote Price",
    ];
    worksheet.addRow(headers);

    // Add data
    quotes.forEach((quote) => {
      // Format timestamp
      const formattedTimestamp = moment(quote.timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      const row = [
        formattedTimestamp,
        quote.name,
        quote.email,
        quote.phone,
        quote.businessType,
        quote.dormant,
        quote.nonTrading,
        quote.freeCompanyFormation,
        quote.numberOfPartners,
        quote.annualTurnover,
        quote.vatReturns,
        quote.payrollSelect,
        quote.numberOfEmployees,
        quote.pensionScheme,
        quote.numberOfEmployeesEnrolling,
        quote.bookkeeping,
        quote.numberOfTransactions,
        quote.quotePrice,
      ];
      worksheet.addRow(row);
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=quotes100.xlsx");

    // Send the workbook as a buffer
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
});

// GET route to render popupRecords.ejs with all popup
app.get("/popupRecords", checkSession, async (req, res) => {
  try {
    const popups = await Popup.find();
    res.render("popupRecords", { popups });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
// POST request to download popups as an Excel file
app.post("/download_popups", async (req, res) => {
  try {
    const popups = await Popup.find();

    // Create a new Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Popups");

    // Add headers
    const headers = [
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Service Type",
      "Message",
    ];
    worksheet.addRow(headers);

    // Add data
    popups.forEach((popup) => {
      // Format timestamp
      const formattedTimestamp = moment(popup.timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      const row = [
        formattedTimestamp,
        popup.name,
        popup.email,
        popup.phone,
        popup.serviceType,
        popup.message,
      ];
      worksheet.addRow(row);
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=popups.xlsx");

    // Send the workbook as a buffer
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
});

// GET route to render quoteRecords.ejs with all quotes
app.get("/quoteRecords", checkSession, async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.render("quoteRecords", { quotes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/download_quotes", async (req, res) => {
  try {
    const quotes = await Quote.find();

    // Create a new Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Quotes");

    // Add headers
    const headers = [
      "Timestamp",
      "Name",
      "Business Name",
      "Email",
      "Business Type",
      "Phone",
      "Annual Turnover",
      "Company Registration",
      "Bookkeeping",
      "VAT Returns",
      "Payroll",
      "Payslips Per Month",
      "Service Duration",
      "Quote Price",
    ];
    worksheet.addRow(headers);

    // Add data
    quotes.forEach((quote) => {
      // Format timestamp
      const formattedTimestamp = moment(quote.timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      const row = [
        formattedTimestamp,
        quote.name,
        quote.businessName,
        quote.email,
        quote.businessType,
        quote.phone,
        quote.annualTurnover,
        quote.companyRegistration,
        quote.bookkeeping,
        quote.vatReturns,
        quote.payroll,
        quote.payslipsPerMonth,
        quote.serviceDuration,
        quote.quotePrice,
      ];
      worksheet.addRow(row);
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=quotes.xlsx");

    // Send the workbook as a buffer
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
});

// Function to send an email
app.post("/send-email", (req, res) => {
  const formData = req.body;

  // Prepare email data
  const userMailOptions = {
    from: "talhayousaf4425@gmail.com",
    to: formData.email,
    subject: "Your Form Submission",
    html: `
      <h1>Thank you for your submission, ${formData.name}!</h1>
      <p>Here is updated summary of your submission:</p>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><th style="text-align: left;">Field</th><th style="text-align: left;">Value</th></tr>
        <tr><td>Name</td><td>${formData.name}</td></tr>
        <tr><td>Email</td><td>${formData.email}</td></tr>
        <tr><td>Phone</td><td>${formData.phone}</td></tr>
        <tr><td>Business Type</td><td>${formData.businessType}</td></tr>
        <tr><td>Dormant</td><td>${formData.dormant}</td></tr>
        <tr><td>Non-Trading</td><td>${formData.nonTrading}</td></tr>
        <tr><td>Free Company Formation</td><td>${formData.freeCompanyFormation}</td></tr>
        <tr><td>Number of Partners</td><td>${formData.numberOfPartners}</td></tr>
        <tr><td>Annual Turnover</td><td>${formData.annualTurnover}</td></tr>
        <tr><td>VAT Returns</td><td>${formData.vatReturns}</td></tr>
        <tr><td>Payroll</td><td>${formData.payrollSelect}</td></tr>
        <tr><td>Number of Employees</td><td>${formData.numberOfEmployees}</td></tr>
        <tr><td>Pension Scheme</td><td>${formData.pensionScheme}</td></tr>
        <tr><td>Number of Employees Enrolling</td><td>${formData.numberOfEmployeesEnrolling}</td></tr>
        <tr><td>Bookkeeping</td><td>${formData.bookkeeping}</td></tr>
        <tr><td>Number of Transactions</td><td>${formData.numberOfTransactions}</td></tr>
        <tr><td>Quote Price</td><td>${formData.quotePrice}</td></tr>
      </table>
    `,
  };

  const adminMailOptions = {
    from: "talhayousaf4425@gmail.com",
    to: "talhayousaf4420@gmail.com",
    subject: "New Form Submission",
    html: `
      <h1>New Form Submission</h1>
      <p>New form submission received:</p>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><th style="text-align: left;">Field</th><th style="text-align: left;">Value</th></tr>
        <tr><td>Name</td><td>${formData.name}</td></tr>
        <tr><td>Email</td><td>${formData.email}</td></tr>
        <tr><td>Phone</td><td>${formData.phone}</td></tr>
        <tr><td>Business Type</td><td>${formData.businessType}</td></tr>
        <tr><td>Dormant</td><td>${formData.dormant}</td></tr>
        <tr><td>Non-Trading</td><td>${formData.nonTrading}</td></tr>
        <tr><td>Free Company Formation</td><td>${formData.freeCompanyFormation}</td></tr>
        <tr><td>Number of Partners</td><td>${formData.numberOfPartners}</td></tr>
        <tr><td>Annual Turnover</td><td>${formData.annualTurnover}</td></tr>
        <tr><td>VAT Returns</td><td>${formData.vatReturns}</td></tr>
        <tr><td>Payroll</td><td>${formData.payrollSelect}</td></tr>
        <tr><td>Number of Employees</td><td>${formData.numberOfEmployees}</td></tr>
        <tr><td>Pension Scheme</td><td>${formData.pensionScheme}</td></tr>
        <tr><td>Number of Employees Enrolling</td><td>${formData.numberOfEmployeesEnrolling}</td></tr>
        <tr><td>Bookkeeping</td><td>${formData.bookkeeping}</td></tr>
        <tr><td>Number of Transactions</td><td>${formData.numberOfTransactions}</td></tr>
        <tr><td>Quote Price</td><td>${formData.quotePrice}</td></tr>
      </table>
    `,
  };

  // Log formData to verify its structure
  console.log("FormData:", formData);
  console.log("User Mail Options:", userMailOptions);

  // Send email to user
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email to user:", error);
      return res.status(500).json({ error: "Failed to send email to user." });
    }

    // Send email to admin
    transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email to admin:", error);
        return res
          .status(500)
          .json({ error: "Failed to send email to admin." });
      }

      res.status(200).json({ message: "Emails sent successfully!" });
    });
  });
});

app.get("/dashboard", async (req, res) => {
  try {
    res.render("dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Login route
app.get("/login", (req, res) => {
  res.render("login");
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/login");
    }
  });
});

// POST request to handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username &&
    password &&
    username === validCredentials.username &&
    password === validCredentials.password
  ) {
    req.session.authenticated = true;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid credentials");
  }
});

// Root route
app.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
