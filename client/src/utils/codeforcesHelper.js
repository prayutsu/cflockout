export const checkCfUsername = (cfUsername) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${cfUsername}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        resolve();
      }
      reject();
    } catch (error) {
      reject();
    }
  });
};
