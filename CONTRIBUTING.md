# Basic contribution guidelines
* If you would like to contribute through development, please request an invite from @Wspiro You can find him on the dev slack. After that read about Branches below.
* If you would like to contribute through testing - please install the beta version of the chrome extension.
* If you would like to contribute through taking screenshots for the web store - make sure you're using the latest version of the stable version of the extension and post issues with your screenshots. You could also be pre-emptive and submit screenshots taken from the beta version, allowing us to have up-to-date screenshots by the time that goes live.

## Making changes to the extension
If you would like to make changes, I suggest reviewing the issues, and see if a discussion related to the feature or bug you want to work on exists. There may already be a discussion about the best way to implement something.
If you don't know what you want to work on, see the issues, and pick one that looks fun to you, or "Good first Issue".

### Branches
We're working somewhat based on the ![Git flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html). 

Feature Branches - this is what you will do most of your work on. This is where you work on a new feature. Keep submitting your commits here until the feature is complete, and you've tested it so you know there shouldn't be any bugs. When creating a feature branch I would suggest branching off of Master(unless you're dependent upon something in another branch). I suggest adding a suffix of `-feature` when working on a new feature or feature improvement to be clear to others yours is a feature branch

Release Branch - usually named v1-## - Once a feature branch has been completed and tested, submit a pull request to merge it into the release branch. Doing this will allow others to review the feature, doublecheck that it works and also doesn't conflict with other features intended for this release. 

Once a feature branch has been merged into the release branch you can delete your feature branch. However only bug fixes should be done on the release branch. The idea is that the Release branch should always be stable with every commit, thus bug fixes are the only things that should be added to it after feature branches are merged.

Occasionally one of the primary contributors will submit this release branch to the chrome web store for the beta version of the chrome extension. Enabling people interested in beta testing to provide feedback and point out bugs, allowing them to be addressed before hitting everyone using the stable extension.

Once a release branch is considered stable and all of the features from it's milestone are in there and tested, a pull request from release branch to master branch should be done. Again allowing others to review the branch, test and make sure the features are all there and working as intended. Once reviewed and approved it merges into the master branch.

The Master Branch we try not to edit directly - only ever doing it if we need to remove functionality or hotfix something.

The Master Branch gets taken by one of the primary contributors and submitted to the Google Chrome Web Store to push an update out to the live version of the extension.

## Versioning
We follow the ![semantic versioning guidelines](https://semver.org/). Major.Minor.Patch
Most contributors wont have to worry about this - mostly just the primary ones who will be submitting to the chrome web store. In order to submit to the chrome web store a version number must increment up from the previous submitted version.
