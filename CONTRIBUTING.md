# Contributing Guidelines

We would love for you to contribute to skelvy and help make it even better than it is today! 
As a contributor, here are the guidelines we would like you to follow:

* [Issues and Bugs](#issue)
* [Feature Requests](#feature)
* [Submission Guidelines](#submit)
* [Development Setup](#development)
* [Coding Rules](#rules)
* [Commit Message Guidelines](#commit)

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to _implement_ a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
  discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
  and help you to craft the change so that it is successfully accepted into the project. For your 
  issue name, please prefix your proposal with `[discussion]`, for example "[discussion]: your feature idea".
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem 
already exists and the discussion might inform you of workarounds readily available.

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub][pulls] for an open or closed PR
   that relates to your submission. You don't want to duplicate effort.
1. Fork the repository.
1. Make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch master
   ```

1. Create your patch, **including appropriate test cases**.
1. Follow our [Coding Rules](#rules).
1. Run the full test suite
1. Commit your changes using a descriptive commit message that follows our
   [commit message conventions](#commit). Adherence to these conventions
   is necessary because release notes are automatically generated from these messages.

   ```shell
   git commit -a
   ```

   Note: the optional commit `-a` command line option will automatically "add" edited files.

1. Push your branch to GitHub:

   ```shell
   git push origin my-fix-branch
   ```

1. In GitHub, send a pull request to `skelvy-client:master`.

* If we suggest changes then:

  * Make the required updates.
  * Re-run the test suites to ensure tests are still passing.
  * Rebase your branch to upstream and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git checkout master
    git pull upstream master
    git checkout your-feature-branch
    git rebase upstream/master
  
    Once you have fixed conflicts
  
    git rebase --continue
    git push -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

* Check out the master branch:

  ```shell
  git checkout master -f
  ```

* Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

* Update your master with the latest upstream version:

  ```shell
  git pull upstream master
  ```

## <a name="development"></a> Development Setup

You will need Node.js version 10.15.0+.

1. After cloning the repo, run:

```bash
$ npm i # (or yarn install)
```

2. Fill keys (marked as REPLACE_WITH_SECRET) in config.xml and package.json

3. In order to prepare your environment run `prepare.sh` shell script:

```bash
$ npm i -g ionic cordova@8
$ npm i -g native-run // not necessary
$ npm install
# read preparing environment
$ sh scripts/prepare.sh // TODO: script is not ready yet
```

### Commonly used NPM scripts

```bash
# run server
$ npm start
$ npm run ios
$ npm run android

# run linter
$ npm run lint

# run formatter
$ npm run format

# translate texts
$ npm run translate
```

### Preparing iOS environment

```bash
# install cocoapods
$ npm run ios:prepare
# add developer account
$ npm install -g ios-sim
$ npm install -g --unsafe-perm ios-deploy
# xcode sdk has to match device ios version
```

More: [iOS Setup](https://ionicframework.com/docs/installation/ios)

### Publishing iOS version

```bash
# increment version in config.xml and package.json
$ npm run ios:build
# add developer account
# open xcode and run Archive
# run Organiser
```

### Preparing Android environment

```bash
# java + gradle
# set sdk environment variables
$ npm run android:prepare
# copy custom config
# accept sdk licenses
$ ~/Library/Android/sdk/tools/bin/sdkmanager --licenses
# add debug keystore to .android
# change ip address in environment
# internet on emulator/device is required. Use dns zone 8.8.8.8/8.8.4.4
```

More: [Android Setup](https://ionicframework.com/docs/installation/android)

### Publishing Android version

```bash
# increment version in config.xml and package.json
$ npm run android:build
$ cd platforms/android/app/build/outputs/apk/release
# copy release keystore 
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks app-release-unsigned.apk upload 
$ rm app-release.apk # remove previous apk
$ ~/Library/Android/sdk/build-tools/29.0.1/zipalign -v 4 app-release-unsigned.apk app-release.apk 
```

### Hashes and Keystores

```bash
# Google hash:

# Debug:
$ keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "C=US, O=Android, CN=Android Debug"
$ keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release
$ keytool -genkeypair -alias upload -keyalg RSA -keysize 2048 -validity 9125 -keystore keystore.jks
$ keytool -export -rfc -alias upload -file upload_certificate.pem -keystore keystore.jks
$ keytool -list -v -keystore keystore.jks -alias upload -storepass XXX -keypass XXX

# Facebook hash:

# Debug
$ keytool -exportcert -alias androiddebugkey -keystore debug.keystore | openssl sha1 -binary | openssl base64

# Production
$ keytool -exportcert -alias upload -keystore keystore.jks | openssl sha1 -binary | openssl base64

# Extra
$ keytool -list -v -keystore debug.keystore
```

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* We follow [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

```
docs(contributing) update list of commit types
bugfix(profile) add missing border on avatar
```

### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies
* **ci**: Changes to our CI configuration files and scripts
* **docs**: Documentation only changes
* **feature**: A new feature
* **bugfix**: A bug fix
* **performance**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

### Scope

The scope help others in recognising which package was affected.

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

[github]: https://github.com/rafalschmidt97/skelvy-client
[pulls]: https://github.com/rafalschmidt97/skelvy-client/pulls
