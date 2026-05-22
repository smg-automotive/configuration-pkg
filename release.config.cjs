const prereleaseBranchName = '{!(+([0-9])?(.{+([0-9]),x}).x|main),**/*}';
const prereleaseIdentifier =
  '${name.replace(/[^0-9A-Za-z-]+/g, "-").replace(/^-+|-+$/g, "")}';

module.exports = {
  branches: [
    'main',
    '+([0-9])?(.{+([0-9]),x}).x',
    {
      name: prereleaseBranchName,
      channel: prereleaseIdentifier,
      prerelease: prereleaseIdentifier,
    },
  ],
};
