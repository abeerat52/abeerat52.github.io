const express = require("express")
const mongoose= require('mongoose');
const nodemailer = require("nodemailer")
const router = express.Router()
const bcrypt = require("bcrypt")
const XLSX = require("xlsx")
const wb = XLSX.readFile("./companyNo.xlsx")
const { User, signupJoi, loginJoi, profileJoi,signupDRAJoi, resetPassJoi, CompanyJoi,editCompanyJoi, } = require("../model/user")
const {SpecialistLicense,SpecialistJoi}=require("../model/SpecialistLicense")
const jwt = require("jsonwebtoken")
require('dotenv').config()
//user signup
router.post("/signup", async (req, res) => {
    try {
        //content
        const { firstName, lastName, username,email,gender, password , role} = req.body

        //validate
        const result = signupJoi(req.body)

        if (result.error) return res.status(400).json(result.error.details[0].message)

        //check email 
        let userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json("مستخدم المسجل البريد الإلكتروني بالفعل مأخوذ")
        
        userFound = await User.findOne({ username })
        if (userFound) return res.status(400).json("مستخدم مسجل بالفعل ، اسم المستخدم مأخوذ")

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const userBody = new User({
            firstName,
            lastName,
            username,
            email,
            gender,
            password: hash,
            role ,
        })
        if (userBody.gender=="male") {
             userBody.avatar ="https://www.terrainhopperusa.com/wp-content/uploads/2019/01/avatar-man.png"
            }
        else if (userBody.gender=="fmale"){
            userBody.avatar ="https://www.terrainhopperusa.com/wp-content/uploads/2019/01/avatar-woman.png"
         
        }
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.Email_KEY, // generated ethereal user
                pass: process.env.PASSWORD_KEY, // generated ethereal password

            },
        })

        const token = jwt.sign({ id: userBody._id, emailVerification: true }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
        await transporter.sendMail({
            from: ` 'Team Work' <${process.env.Email_KEY}>`, // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
                    table {
                        border-collapse: collapse !important;
                    }
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
       
                    <tr>
                        <td bgcolor="#C797C8" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 30px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#C797C8" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                         <img src="https://cdn-icons-png.flaticon.com/512/5331/5331926.png" width="125" height="120" style="display: block; border: 0px; color:" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#C797C8" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">يسرنا انظمامك ، تحتاج إلى تأكيد حسابك. فقط اضغط على الزر أدناه.
.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#C797C8"><a href="http://localhost:3000/email_verified/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #C797C8; display: inline-block;">تأكيد الحساب</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> 
                </table>
                <tr>
                    <td bgcolor="#C797C8" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                    
                </tr>
                <tr>
                    <td bgcolor="#C797C8" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                <tr>
                </td>
            </body>
            
            </html>`
        })
      
        await userBody.save()

        delete userBody._doc.password

        res.json(userBody)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }


})
//Admin signup
router.post("/signup/admin", async (req, res) => {
    try {
        //content
        const { firstName, lastName, username,avatar, email, password , role, Admin} = req.body

        //validate
        const result = signupJoi(req.body)

        if (result.error) return res.status(400).json(result.error.details[0].message)

        //check email 
        let userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json("مستخدم المسجل البريد الإلكتروني بالفعل مأخوذ")
        
        userFound = await User.findOne({ username })
        if (userFound) return res.status(400).json("مستخدم مسجل بالفعل ، اسم المستخدم مأخوذ")

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const userBody = new User({
            firstName,
            lastName,
            username,
            email,
            password: hash,
            role:"Admin" ,
     
        })
    
                email 
          const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.Email_KEY, // generated ethereal user
                pass: process.env.PASSWORD_KEY, // generated ethereal password

            },
        })

        const token = jwt.sign({ id: userBody._id, emailVerification: true }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
        await transporter.sendMail({
            from: ` 'MyMediForm' <${process.env.Email_KEY}>`, // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
                    table {
                        border-collapse: collapse !important;
                    }
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#000B49" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 30px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#000B49" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                         <img src="https://cdn-icons-png.flaticon.com/512/5331/5331926.png" width="125" height="120" style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#000B49" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">يسرنا انظمامك ، تحتاج إلى تأكيد حسابك. فقط اضغط على الزر أدناه..</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#000B49"><a href="http://localhost:3000/email_verified/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #000B49; display: inline-block;">Confirm Account</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> 
                </table>
                <tr>
                    <td bgcolor="#000B49" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                    
                </tr>
                <tr>
                    <td bgcolor="#000B49" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                <tr>
                </td>
            </body>
            
            </html>`
        })
        await userBody.save()

        delete userBody._doc.password

        res.json(userBody)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }


})
//company signup
router.post("/signup/company", async (req, res) => {
    try {
        //content
        const { companyName,company_No, username, email, password , role} = req.body

        //validate
        const result =CompanyJoi(req.body)

        if (result.error) return res.status(400).json(result.error.details[0].message)
        //check email 
        let userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json("مستخدم المسجل البريد الإلكتروني بالفعل مأخوذ")
        userFound = await User.findOne({ username })
        if (userFound) return res.status(400).json("مستخدم مسجل بالفعل ، اسم المستخدم مأخوذ")
        userFound = await User.findOne({company_No})
        if (userFound) return res.status(400).json("الشركة مسجله بالفعل ")
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const userBody = new User({
            companyName,
            company_No,
            username,
            email,
            password: hash,
            role:"Company" ,
        })

        const ws =wb.Sheets[wb.SheetNames[0]]
        let value =true
       // console.log(ws[`A${5}`].v==company_No)
       loop:for (let i =2;i <1000;i++){
               const row =ws[`A${i}`].v
            if (row==userBody.company_No ){
              console.log("register comblited")
              value =true
              break 
              } else 
             value =false
          continue
            }
            console.log(value)
            if (value==false)return res.status(404).json("رقم الشركه غير صحيح")




               const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.Email_KEY, // generated ethereal user
                pass: process.env.PASSWORD_KEY, // generated ethereal password

            },
        })

        const token = jwt.sign({ id: userBody._id, emailVerification: true }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
        await transporter.sendMail({
            from: ` 'Team Work' <${process.env.Email_KEY}>`, // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
                    table {
                        border-collapse: collapse !important;
                    }
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#000B49" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 30px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#000B49" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                         <img src="https://cdn-icons-png.flaticon.com/512/5331/5331926.png" width="125" height="120" style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#000B49" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">We're excited to have you get started. 
                                            First, you need to confirm your account. 
                                            Just press the button below.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#000B49"><a href="http://localhost:3000/email_verified/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #000B49; display: inline-block;">Confirm Account</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> 
                </table>
                <tr>
                    <td bgcolor="#000B49" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                    
                </tr>
                <tr>
                    <td bgcolor="#000B49" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                <tr>
                </td>
            </body>
            
            </html>`
        })



        //     let wes =wb.Sheets[wb.SheetNames[0]]
        //   for (let index = 1; index <1000; index++) {
        //     const coNo =wes[`A${index}`].v;
        //         if (company_No==coNo){
        //              res.status(400).json("register comblited")
        //              break 
        //         }else
        //         return res.status(400).json("the company number is not correct !!")
        //    }
          
          await userBody.save()
           delete userBody._doc.password
          res.json(userBody)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }

})
//DRA signup
router.post("/signup/dra", async (req, res) => {
    try {
     //check token
     const token = req.header("Authorization")
     if (!token) return res.status(401).json("token is missing")

     const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
     const userId = decryptToken.id

     const user = await User.findById(userId).select("-password")
     if (!user) return res.status(404).json("المستخدم غير موجود")
     req.userId = userId


        const isAdmin = await User.findById(userId)
        if (!isAdmin) return res.status(404).json("المستخدم غير موجود")
      if (isAdmin.role!=="Admin") return res.status(404).send("فقط المشرف يمكنه اضافه حساب جديد !!")

        //content
        const {firstName, username, email, password , role} = req.body

        //validate
       const result =signupDRAJoi(req.body)

        if (result.error) return res.status(400).json(result.error.details[0].message)
        //check email 
        let userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json("user already registered email taken")
        userFound = await User.findOne({ username })
        if (userFound) return res.status(400).json("user already registered username taken")
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const userBody = new User({
            firstName,
    
            username,
            email,
            password: hash,
            role:"DRA" ,
           avatar :"http://old.sfda.gov.sa/_layouts/sfda/new/images/default_news.png"
        })
               const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.Email_KEY, // generated ethereal user
                pass: process.env.PASSWORD_KEY, // generated ethereal password

            },
        })

        const token1 = jwt.sign({ id: userBody._id, emailVerification: true }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
        await transporter.sendMail({
            from: ` 'Team Work' <${process.env.Email_KEY}>`, // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
                    table {
                        border-collapse: collapse !important;
                    }
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
              
                    <tr>
                        <td bgcolor="#000B49" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 30px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#000B49" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                         <img src="https://cdn-icons-png.flaticon.com/512/5331/5331926.png" width="125" height="120" style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#000B49" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">يسرنا انظمامك ، تحتاج إلى تأكيد حسابك. فقط اضغط على الزر أدناه.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#000B49"><a href="http://localhost:3000/email_verified/${token1}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #000B49; display: inline-block;">Confirm Account</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> 
                </table>
                <tr>
                    <td bgcolor="#000B49" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                    
                </tr>
                <tr>
                    <td bgcolor="#000B49" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                <tr>
                </td>
            </body>
            
            </html>`
        })
        await userBody.save()

        delete userBody._doc.password

        res.json(userBody)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }


})
//login 
router.post("/login", async (req, res) => {
    try {
        const { username, email, password } = req.body

        //validate
        const result = loginJoi(req.body)
        if (result.error) return res.status(400).json(result.error.details[0].message)
        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (!user) return res.status(404).json("اسم المستخدم او البريد الالكتروني غير صحيح")
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(400).json("كلمه المرور خاطئه")

        if (!user.emailVerified) return res.status(403).send("لم يتم التحقق من المستخدم ، يرجى التحقق من البريد الإلكتروني الخاص بك")
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10d" })

        res.send(token)

    } catch (error) {
        console.log(error)
        res.status(500).json("The problem in server")
    }
})
//display profile
router.get("/profile", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decryptToken.id
        req.userId = userId

        const user = await User.findById(req.userId).select("-password").populate({ path:"comments" ,populate:{path:"comment"}}).populate({ path:"post" ,populate:{path:"title"}})

        if (!user) return res.status(404).json("user not found")
        // console.log(user)
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")

    }
})
router.get("/verify_email/:token", async (req, res) => {
    try {
        const decryptedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
        const userId = decryptedToken.id;

        if (!decryptedToken.emailVerification) return res.status(403).json("Unauthorized action")

        const user = await User.findByIdAndUpdate(userId, { $set: { emailVerified: true } })
        if (!user) return res.status(404).send("user not found");
        res.send("user verified")
    } catch (error) {
        res.status(500).send(error.message)
    }
})
// edit company profile
router.put("/profile/editCompany", async (req, res) => {
    const {    company_No, companyName, username, avatar, email, password } = req.body

    //check token
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is missing")

    const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptToken.id
    req.userId = userId

    const user = await User.findById(userId).select("-password")
    if (!user) return res.status(404).json("user not found")

    //validate
    const result = editCompanyJoi(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    let hash
    if (password) {
        const salt = await bcrypt.genSalt(10)
        hash = await bcrypt.hash(password, salt)
    }

    const editUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: {  company_No, companyName ,username, email, password: hash, avatar } },
        { new: true }).select("-__v -password")

    res.json(editUser)

})
//get email verification 
router.get("/verify_email/:token", async (req, res) => {
    try {
        const decryptedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
        const userId = decryptedToken.id;

        if (!decryptedToken.emailVerification) return res.status(403).json("Unauthorized action")

        const user = await User.findByIdAndUpdate(userId, { $set: { emailVerified: true } })
        if (!user) return res.status(404).send("user not found");
        res.send("user verified")
    } catch (error) {
        res.status(500).send(error.message)
    }
})
// edit profile
router.put("/profile/edit", async (req, res) => {
    const { firstName, username, lastName, avatar, email, password } = req.body

    //check token
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is missing")

    const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptToken.id
    req.userId = userId

    const user = await User.findById(userId).select("-password")
    if (!user) return res.status(404).json("user not found")

    //validate
    const result = profileJoi(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    let hash
    if (password) {
        const salt = await bcrypt.genSalt(10)
        hash = await bcrypt.hash(password, salt)
    }

    const editUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: { firstName, lastName, username, email, password: hash, avatar } },
        { new: true }).select("-__v -password")

    res.json(editUser)

})
//reset passwod 
router.post("/forgot-password", async (req, res) => {
    try {
        const { email, username } = req.body
        //validate
        const result = resetPassJoi(req.body)
        if (result.error) return res.status(400).json(result.error.details[0].message)

        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (!user) return res.status(404).json("اسم المستخدم او البريد الالكتروني غير صحيح")

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.Email_KEY, // generated ethereal user
                pass: process.env.PASSWORD_KEY, // generated ethereal password

            },
        })
        const token = jwt.sign({ id: user._id, forgotPassword: true }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
        await transporter.sendMail({
            from: ` 'MyMideForm' <${process.env.Email_KEY}>`, // sender address
            to: user.email, // list of receivers
            subject: "Reset Password", // Subject line
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
                    table {
                        border-collapse: collapse !important;
                    }
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> سمعنا ان لديك مشكله في التسجيل الدخول لدينا  </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#C797C8" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 30px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#C797C8" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">مرحبا بعودتك</h1> <img src="https://cdn-icons-png.flaticon.com/512/1745/1745558.png" width="125" height="120" style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#C797C8" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">اضغط على الزر ادناه لاستعاده كلمه المرور الخاصه بك</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#C797C8"><a href="http://localhost:3000/reset-password/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #C797C8; display: inline-block;"> Reset Password</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> 
                </table>
                <tr>
                    <td bgcolor="#C797C8" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                    
                </tr>
                <tr>
                    <td bgcolor="#C797C8" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    
                <tr>
                </td>
            </body>
            
            </html>`,
        })

        res.json("reset password link sent")
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
router.post("/reset-password/:token", async (req, res) => {
    try {
        const decryptedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);

        if (!decryptedToken.forgotPassword) return res.status(403).json("Unauthorized action")

        const userId = decryptedToken.id;
        const user = await User.findById(userId)
        if (!user) return res.status(404).send("user not found");

        const { password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        await User.findByIdAndUpdate(userId, { $set: { password: hash } })

        res.json("password reset")
    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})
//delete acc
router.delete("/:id", async (req, res) => {
    const isAdmin = await User.findById(userId)
    if (!isAdmin) return res.status(404).json("user not found")
      if (req.body.userId === req.params.id ||isAdmin.role=="Admin") {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You cant delete only your account!");
    }
  });
///
router.post("/upgrade", async (req, res) => {
    try {
        //check token
        const token = req.header("Authorization")
        if (!token) return res.status(401).json("token is missing")

        const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const UserId = decryptToken.id
        req.UserId = UserId

        const user = await User.findById(UserId).select("-password")
        if (!user) return res.status(404).json("المستخدم غير موجود")

        const isConsumer = await User.findById(UserId)
        if (!isConsumer ) return res.status(404).json("المستخدم غير موجود")
     if (isConsumer.role!=="Consumer") return res.status(404).send("you are not allowed to upGrade your acc ")
        
        //validate
        const result = SpecialistJoi(req.body)
        if (result.error) return res.status(404).json(result.error.details[0].message)

        //requset body comment
        const {Licensenumber} = req.body
        //create comment 
        const newSpecialistLicense = new SpecialistLicense({
            Licensenumber,
              owner: req.UserId,
             })
        
        await User.findByIdAndUpdate(req.UserId, { $push: {   SpecialistLicense: newSpecialistLicense._id } })
        await newSpecialistLicense.save()
        res.json(newSpecialistLicense)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("The problem in server")
    }
})

router.put("/AcceptLicense/:SpecialistLicenseid", async (req, res) => {
        try {
            const id = req.params.SpecialistLicenseid
            if (!mongoose.Types.ObjectId.isValid(id))
                return res.status(400).send("The path is not valid object id")
            let specialistLicense = await SpecialistLicense.findById(req.params.SpecialistLicenseid)
            if (!specialistLicense) return res.status(404).json("post not found")
    
                await User.findByIdAndUpdate(specialistLicense.owner, { $set:{role:"Specialist" } })
                await User.findByIdAndUpdate(specialistLicense.owner, { $set:{avatar:"https://cdn1.iconfinder.com/data/icons/avatar-3/512/Doctor-512.png" } })

                res.json("تم ترقيه الحساب بنجاح")

        } catch (error) {
            console.log(error.message)
            res.status(500).json("The problem in server")
        }
    })

    router.get("/License", async (req, res) => {
        try {
            const License = await SpecialistLicense.find().sort("-Date")
            res.json(License)
        } catch (error) {
            console.log(error.message)
            res.status(500).json("The problem in server")
        }
    })


    router.delete("/License/:id", async (req, res) => {
        try {
            //check id
            const id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id))
                return res.status(400).send("The path is not valid")
        
                const specialistLicense = await SpecialistLicense.findByIdAndRemove(req.params.id)
                 if (!specialistLicense) return res.status(404).json("post not found")
         
            await User.findByIdAndUpdate(req.userId, { $pull: {specialistLicense: specialistLicense._id } })
            res.json("تم حذف طلب ترقيه الحساب") 
        } catch (error) {
            console.log(error.message)
            res.status(500).json("The problem in server")
        }
    })

module.exports = router;