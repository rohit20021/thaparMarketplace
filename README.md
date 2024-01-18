# Thapar_marketplace
I have created a simple backend of a marketplace where student can buy and sell different used and new items in the university


In this project there are 3 modules:-
* item
* user
* User OTP verification

item:- in this, i have defined the item schema with the validation function to check input errors
user:- in this, i have defined the user schema with the validation function to check input errors and a method to generate an authentication token during login time
User OTP verification:- this module takes care of otp verification during the creation of a new user with the help of node mailer


I have created 4 routers

* items
these are the following APIs I have created

- GET '/': Retrieves all items sorted by name.
- GET '/my_items/:id': Retrieves a specific item by ID.
- GET '/my_items/': Retrieves items belonging to the authenticated user.
- POST '/': Creates a new item associated with the authenticated user.
- DELETE '/my_items/:id': Deletes an item by ID if it belongs to the authenticated user.

* user (user authentication)
  
- GET '/mydetails': Retrieves details of the authenticated user excluding tokens and passwords.
- POST '/signup': Registers a new user with verification using OTP sent via email.
- POST '/otpvarify': Verifies the OTP for a user based on the provided user ID and OTP.
- POST '/resendotp': Resends OTP to the user's email for verification.


*auth

'/login'
- Validate user input for Thapar student email, password, and roll number.
- Checks if the email adheres to the Thapar domain and matches the provided roll number.
- Verifies the password by comparing it with the hashed password stored in the database.
- Generates an authentication token upon successful login.
