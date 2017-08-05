
# Movement Vote Concierge

Web application for donor interaction with the groups supported by Movement
2018.

## Development setup

Clone the *Github* repo, then install the dependencies using *npm*.

```
git clone https://github.com/movement-2016/concierge.git
cd concierge
npm install
```

You will need some global tools

```
npm i gulp -g
npm i pm2 -g
```

### Build

```bash
npm run build
```

*build* is a continuous build option - the gulp build will
set up watches and rerun build elements as file changes are saved.
`npm run build-stage` is a one time build option for poduction.

### Server

In a terminal, continuous server operation, updating on changes,
can be activated with

```
npm run start
```

The *nodemon* utility provides restart on update.

### Client

After starting a server instance, open a browser and then access the
application at http://localhost:3000

## Deployment

Deploy to AWS EC2.

```bash
bin/deploy
```

N.B. This must be done after a `git push` If you commit something locally and don't push the deploy will fail.

### Maintenance

#### HTTP Ports

By default the server will run on HTTP port 3000, in order to point port 80 AWS requires the following:

````
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
````

The HTTPS server will run on HTTP port 4000, in order to point port 443 AWS requires the following:

````
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 4000
````

#### letsencrypt Cert Expires

Before doing anything else, disable any cloudflair redirections.

`ssh` into the AWS server, change to certbot directory, look for an appropriate script to run the renew task.

If the cert is fully expired you may not be able to `ssh` into the AWS instance. In this case reboot the instance. 

If rebooting does not get you in, then stop/start the instance but *NOTE* if you stop/start the instance you will be assigned a new IP address. 

#### If the IP Changes

The IP of the AWS server can change when you stop/(re)start the instance. In that case you will have to rerun the HTTP ports commands above before starting the web server(s).

#### GMail Authorization

If there are errors sending email or the contact email or the domain changes you'll need to re-run the GMail auhorization script. Please see bin/gmail-auth.js for details.


#### cron Reboots

Because of a memory leak tracked back to mismatches in [Node and expressjs](https://github.com/expressjs/express/issues/2997) there was a time when we rebooted the server in a crontab twice a day. This may or may not be the case as you read this. Check for crontabs as root (sudo) as well as ec2-user before ruling it out.

## License

MIT
