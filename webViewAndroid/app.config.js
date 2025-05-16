export default ({ config }) => ({
    ...config,
    expo: {
      ...config.expo,
      name: "Hyperion",
      slug: "webview",
      android: {
        package: "com.eduardo270704.hyperion",
        buildType: "apk",
      },
      extra: {
        IP: process.env.IP,
        WEBPORT: process.env.WEBPORT,
      },
    },
  });
  