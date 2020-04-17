# pandemic-simulation

This is a nuxt.js statically generated website. This is a flavor of a JAM stack in that it reaches out and gets the pandemic data at build time. Any webserver will work with this application as long as it serves from the dist directory and has the correct webserver rewrite rules for a SPA.

## Webapp

To see how to build the webapp for local development, see the readme in the webapp directory.

## Hosting

We are using firebase hosting to serve the files in the webapp/dist directory.

## Google Cloud build

The continuous integration and continuous delivery orchestration is done via Googles cloud build service.

https://console.cloud.google.com/cloud-build/builds?project=pandemic-simulation

### Triggers

- cloudbuild-ci.yaml (install + lint + build)
- cloudbuild-cd.yaml (install + lint + generate:data + generate + deploy)
