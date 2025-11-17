## About Repo
This is Kuanta Control Frontend repo for monitoring of firms internal messaging and monitoring system which provides you with the following modules:

1. [Dashboard](./src/app/dashboard)
2. [Node Dashboard](./src/app/dashboard/nodes/[node]/node-dashboard/)
3. [Process](./src/app/dashboard/nodes/[node]/process)
4. [Memory](./src/app/dashboard/nodes/[node]/memory)
5. [Channels - Inbound](./src/app/dashboard/nodes/[node]/channels-inbound) | [Channels - Outbound](./src/app/dashboard/nodes/[node]/channels-outbound)
6. [Audit Logs](./src/app/dashboard/nodes/[node]/audit-log)
7. [Action](./src/app/dashboard/nodes/[node]/action)
8. [Rules](./src/app/dashboard/nodes/[node]/rules)
9. [SPECs](./src/app/dashboard/nodes/[node]/spec)
10. [Identities](./src/app/dashboard/nodes/[node]/identify)
11. [Alerts](./src/app/dashboard/nodes/[node]/alerts-list)
12. [Reports](./src/app/dashboard/nodes/[node]/daily-report-list)

## Prerequisites

- Node.js 20.x (Recommended)

## Installation

**Using Yarn**

```sh
yarn install
```

**Using Npm (Recommended)**

```sh
npm i
```

## Running via Mocking a server

We have provided basic data to test app locally without connecting to server.

Steps to follow:

1. In [`/src/config-global.ts`](./src/config-global.ts) change value for `apiDataType: 'real'` => `apiDataType: 'dummy'`
2. Run `npm run dev`

**Note:** In case you want to change data you can change the data for corresponding endpoint/url in [`/src/mocks`](./src/mocks) directory.

## Running via real server

To run the app via real server you have to follow the following steps:

1. Create `.env.local` file and paste the `NEXT_PUBLIC_SERVER_URL=http://141.164.63.141`
2. Once you are done with creating environment file you are good to go with running it locally by `npm run dev`

## Build

```sh
yarn build
# or
npm run build
```