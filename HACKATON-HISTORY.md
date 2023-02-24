### Until 24.02. you could find all 3 parts of the app in this repository (https://github.com/interflowrepo/interflow):

- Interflow React Native App
- Interflow API
- Interflow Purse API

The idea was to keep all the files in the same repository to make it easier for judges to score, but we had a lot of issues with asynchronous pushes.

On 24/02 we decided to separate the repositories after a push on the root directory from a ReactNative update to remove the Interflow API directory (desperation face)

You can see the push in the commit history here:

https://github.com/interflowrepo/interflow/commit/c095470385ac47810d9e7ef3af0532ba693a68e8

Now the Interflow API is in this repository:

https://github.com/interflowrepo/interflow-api

If you compare the deleted files in this commit:
https://github.com/interflowrepo/interflow/commit/c095470385ac47810d9e7ef3af0532ba693a68e8

With the files added in this commit:
https://github.com/interflowrepo/interflow-api/commit/1e8723b6de8d04d9346322e0731fdb662fa85fcc

You will be able to see that nothing has been changed or added, we are just sending our progress to a new repository.

