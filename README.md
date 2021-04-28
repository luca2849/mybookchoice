# MYBOOKCHOICE

MyBookChoice is a new, and innovative way of gathering book recommendations. It combines the features of modern 'swiper' apps, with more specific methods of passing judgement on books.

## Dev Information

To run MyBookChoice on your local machine, you will first need to have a MongoDB database, named `mybookchoice` on your local system. Next, create a file called `default.json` in `/server/config`, requiring the following format:

```json
{
	"mongoURI": "",
	"jwtSecret": "",
	"jwtExpiry": 123,
	"email": "",
	"password": "",
	"client_url": "",
	"api_url": "",
	"GOOGLE_API_KEY": "",
	"GOOGLE_CLIENT_ID": "",
	"GOOGLE_CLIENT_SECRET": "",
	"FACEBOOK_APP_ACCESS_TOKEN": ""
}
```

Most of these attributes are self-explanatory, however, `email` and `password` refer to the email and password for a G-Mail account which uses Nodemailer to inform users of password changes, for example.

There is also an environment file in the client, `.env`, which is located at `/client/`. This has much fewer attributes.

```env
REACT_APP_MAPBOX_TOKEN=
HTTPS=true
REACT_APP_CLIENT_URL=
REACT_APP_SERVER_URL=
```

Once these files are added, you can then run `npm install` in both the `client` and `server` folders to install the required dependencies. Next, to start the application from the root directory:

```sh
cd server
npm run dev
```

This will then start the server and client in the same console.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
