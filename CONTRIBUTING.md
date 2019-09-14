# Basic contribution guide
* If you would like to contribute through development, you can fork this repo, make your changes and submit a pull request. If you contribute regularly, you can request collaborator access from @wspiro
* If you would like to contribute through testing - please [install the beta version of the chrome extension](https://github.com/williamspiro/HubSpot-Developer-Extension/wiki/How-to-use-the-Beta-version-of-the-extension). Then Join the slack channel and provide feedback, let us know if you find a bug or have an idea.
* If you would like to contribute through taking screenshots for the web store - make sure you're using the latest version of the stable version of the extension and post issues with your screenshots. You could also be pre-emptive and submit screenshots taken from the beta version, allowing us to have up-to-date screenshots by the time that goes live.
* [Don't be a richard, no one likes a richard, sorry Richard.](https://github.com/TheWebTech/HubSpot-Developer-Extension/blob/master/CODE_OF_CONDUCT.md)

## Making changes to the extension
If you would like to make changes, I suggest reviewing the issues, and see if a discussion related to the feature or bug you want to work on exists. There may already be a discussion about the best way to implement something.
If you don't know what you want to work on, see the issues, and pick one that looks fun to you, or "Good first Issue".


## New to Git/GitHub?
[GitHub has tons of great guides](https://guides.github.com/)
* [Learn how to use git by editing a file and pushing your changes](https://guides.github.com/activities/hello-world/)
* [GitHub flow](https://guides.github.com/introduction/flow/) Learn the best practice for working on a github project.
* does the command line freak you out, or is it hard to visualize what's going on? There are GUI programs that can make it easier to understand. [GitHub Desktop](https://desktop.github.com/) and [Source Tree](https://www.sourcetreeapp.com/) are good options.
* When submitting a pull request or resolving an issue it's helpful to note the issue number, that way others have the full context of what you're doing.
* If you don't know how to do something regarding git/github just ask we try our best to help.

### Branches
We're working somewhat based on the [Git flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html). 

Feature Branches - this is what you will do most of your work on. This is where you work on a new feature. Keep submitting your commits here until the feature is complete, and you've tested it so you know there shouldn't be any bugs. When creating a feature branch I would suggest branching off of Master(unless you're dependent upon something in another branch). I suggest adding a suffix of `-feature` when working on a new feature or feature improvement to be clear to others yours is a feature branch. Example: `developer-quick-menu-feature`

Release Branch - usually named v1-## - Once a feature branch has been completed and tested, submit a pull request to merge it into the release branch. Doing this will allow others to review the feature, doublecheck that it works and also doesn't conflict with other features intended for this release. Example release branch name: `v1-04`

If your changes are not a bug fix please pull request to the release branch, that lets us test before going live.

Once a feature branch has been merged into the release branch you can delete your feature branch. However only bug fixes should be done on the release branch. The idea is that the Release branch should always be stable with every commit, thus bug fixes are the only things that should be added to it after feature branches are merged.

Occasionally one of the primary contributors will submit this release branch to the chrome web store for the beta version of the chrome extension. Enabling people interested in beta testing to provide feedback and point out bugs, allowing them to be addressed before hitting everyone using the stable extension.

Once a release branch is considered stable and all of the features from it's milestone are in there and tested, a pull request from release branch to master branch should be done. Again allowing others to review the branch, test and make sure the features are all there and working as intended. Once reviewed and approved it merges into the master branch.

The Master Branch we try not to edit directly - only ever doing it if we need to remove functionality or hotfix something(or are just editing a markdown file).

The Master Branch gets taken by one of the primary contributors and submitted to the Google Chrome Web Store to push an update out to the live version of the extension.


## Pull Requests
When in doubt assign Jon McLaren to Review.

If you have Git related questions feel free to ask Jon McLaren.

## Versioning
We follow the [semantic versioning guidelines](https://semver.org/). Major.Minor.Patch
Most contributors wont have to worry about this - mostly just the primary ones who will be submitting to the chrome web store. In order to submit to the chrome web store a version number must increment up from the previous submitted version.


## Code Cleanliness
Overall we don't want contributing to this extension to feel like a burden. We care most about code functioning without bugs. Cleanliness comes after. That said, to keep the extension easy to update and easy for others to work on and understand, please try to follow best practices regarding code. You'll find Codacy a tool we have monitoring the repo will "yell" at you for not following best practices. Following it's advice will help us to have more consistent, stable and maintanable code.

### Indentation
Please try to follow the indentation amounts you see in the files. This will help the code be easier to read and scan through but most importantly if someone changes the indentation this show up when merged as if you edited all of the code. making merge conflicts really painful to resolve.

### Create re-usable functions where possible
We've all had the DRY(Don't Repeat Yourself) thing drilled into us. Try to create re-usable functions whenever you can and break a big function into smaller functions if it makes sense to. As long as functions are named in easily understandable ways the extension becomes easier to understand and maintain.

### Naming variables, functions etc.
Try to keep names obvious. Don't try to get fancy and use names that mean nothing or are obscure.
The function for Bust Cache:
Bad Example: `who_you_gonna_call_cache_busters()` this is a bad name and you're a bad person, a funny but bad person.
Good Example: 'add_cache_bust_param()' - note we don't actually use this function name it's just an example.

### Add Comments to your code
Anyone should be able to look at your code and understand what it's doing. If you wouldn't be comfortable with somoene dumping this code onto you to have to troubleshoot without any background knowledge of what it did - you need to add comments.

If you have lengthy/complicated if statements, it's a good practice to add a comment explaining the if this then that part in English so someone later can read it in a more human readable way.

### IF you see code you could make more re-usable - more readable, go for it! You're a hero.

