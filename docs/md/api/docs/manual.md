---
layout: ../../README.md
---

# 🧰 Manually deploying

There are mainly 3 ways to deploy `@alpa/api` onto production. For personal usage deploying through [🐳 Docker Compose](./docker.md) is the most easiest & recommended way. For high intensity workloads read about [Kubernetes deployment](./kubernetes.md).

Deploying **alpa**'s API is easy and straightforward by following the below steps:

Manually deploying will allow you to run `@alpa/api` on a production server without additional layers of abstraction.

> **⚠️ Warning:** This method is good for advanced use cases & updating alpa may not be straightforward always.

## 🔍 Prerequisites

1. Node.js version v{{nodeVersion}} or higher ([Windows](https://youtu.be/sHGz607fsVA) / [Linux](https://github.com/nodesource/distributions#readme) / [macOS](https://github.com/nvm-sh/nvm#readme))
2. [Redis database](https://redis.io)
3. [RedisJSON plugin](https://redis.io/docs/stack/json/) for Redis database
4. [RediSearch plugin](https://redis.io/docs/stack/search) for Redis database

## 🚀 Deployment process

As said in this [README.md](https://github.com/vsnthdev/alpa/tree/main#readme) file **alpa** is a monorepo containing multiple projects, follow the below steps to configure `@alpa/api` to run in production.

### 💾 Getting `@alpa/api`

Instead of normally cloning entire repository here are the commands to only clone `@alpa/api` project & the root project 👇

**STEP 1️⃣**  Clone only the root project

```
git clone --single-branch --branch main --depth 1 --filter=blob:none --sparse https://github.com/vsnthdev/alpa
```

**STEP 2️⃣**  Enter the freshly cloned root project

```
cd ./alpa
```

**STEP 3️⃣**  Initialize Git sparse checkout

```
git sparse-checkout init --cone
```

**STEP 4️⃣**  Pull only `@alpa/api` project while ignoring other projects

```
git sparse-checkout set api
```

### 🪄 Installing dependencies

Dependency libraries for both the root project & `@alpa/api` can be installed & setup by running the following command 👇

```
npm install
```

### 💻 Building `@alpa/api`

We only store TypeScript source code in this repository so before we can start `@alpa/api` server, we need to build (_transpile TypeScript into JavaScript_) the project using the following command 👇

```
npm run build
```

### ⚙️ Creating configuration file

An [example config file](../../api/config.example.yml) is already present with all configurable values and their defaults. We'll copy that and make some necessary changes to prepare `@alpa/api` to work in production 👇

```
cp api/config.example.yml api/config.yml
```

### ⚡ Configuring for production

Provided example config file is best suitable for development & testing purposes only. We need to make some changes to the config file to make `@alpa/api` suitable for production environments.

1. 🔒 **Changing username & password**  
    
    The default username (`{{api.config.auth.username}}`) & password (`{{api.config.auth.password}}`) are extremely insecure. Change both the `auth.username` and `auth.password` fields with better values. And avoid setting the username to commonly guessable values like `admin`, `alpa`, `sudo`, `root` etc.

<br>

2. 🔌 **Changing database connection URL**

    The default database connection URL (`{{api.config.database.connection}}`) is mainly for connecting to an internal Docker container.

    Change the value of `database.connection` field to a Redis database connection URL without a database number pre-selected. Preferably to an empty Redis database exclusively to be used with `@alpa/api`. Using a shared database is also possible with additional configuration.

    > ⚠️ **Warning:** The Redis database must have RedisJSON & RediSearch plugins enabled & working.

<br>

3. 🔑 **Changing server's secret key**

    This secret key is used to sign the JWT authentication tokens, since the default (`{{api.config.server.secret}}`) is already known to everyone. It is insecure to use it.

    Preferably use a password generator to generate a 64 character long random string here.

    > ⚠️ **Warning:** Failing to change the secret key, or using a small secret key will get you into the risk of getting `@alpa/api` hacked. A minimum of 64 characters is recommended.

<br>

4. 🔗 **Changing allowed domains**

    [CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) are sent by `@alpa/api` to prevent misuse & accessing the API from unauthorized origins.

    Remove `localhost` entries from `server.cors` field to prevent everyone from self-deploying `@alpa/app` and accessing your instance of `@alpa/api` from their own computer.

    Finally, if you're not using the universal deployment of `@alpa/app` at https://alpa.vercel.app then also remove that entry as a safety measure while adding the full URL of `@alpa/app` hosted by you to allow, programmatic communication from that URL.

### ✨ Starting `@alpa/api`

With the above mentioned changes being done to the configuration file, `@alpa/api` is now ready to be started in a production environment safely.

On Linux & macOS operating systems run the below command 👇

```bash
NODE_ENV=production node api/dist/index.js
```

If you're on Windows (_but seriously? why!_ 🤷‍♂️) then use [cross-env](https://www.npmjs.com/package/cross-env) to set the `NODE_ENV` to production 👇 and start `@alpa/api`:

```bash
npx cross-env NODE_ENV=production node api/dist/index.js
```

> ℹ️ **Info:** During this process npm may ask you whether to install `cross-env` depending on if you already have it.

After following the above steps you should be able to login from the configured client and start enjoying **alpa**.

**If you're still facing issues, refer the [troubleshooting & help section]() for further information.**

<!-- ### 🔐 Securing behind NGINX reverse proxy -->

<!-- ### 🤖 Creating system service -->

<!-- ### ♻️ Handling updates -->
