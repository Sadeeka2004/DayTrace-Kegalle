DayTrace Kegalle - Database Files

Database type : MongoDB (hosted on MongoDB Atlas)
Database name : daytrace_kegalle

FILES IN THIS FOLDER
--------------------
attractions.json  -> All attraction places (10 places with locations,
                     opening hours, travel tips, images, etc.)
branding.json     -> Website logo and branding settings

These files are a sample snapshot of the data, exported from MongoDB Atlas.
The application does not read these files while running. It reads the data
directly from MongoDB Atlas using the MONGODB_URI in the backend .env file.

ADMIN ACCOUNT
-------------
The admin account is not included for security reasons (passwords are
never shared). It is created by running this command in the backend folder:

    npm run admin:setup

using ADMIN_USERNAME and ADMIN_PASSWORD from the backend .env file.

HOW TO RE-EXPORT THE DATA
-------------------------
Run this command in the daytrace-backend folder:

    npm run db:export